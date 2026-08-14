const express = require('express');
const Problem = require('../models/Problem');
const Topic = require('../models/Topic');
const UserProgress = require('../models/UserProgress');
const Bookmark = require('../models/Bookmark');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// Helper to calculate daily streak from solved_at dates
const calculateStreak = (solvedDates) => {
  if (!solvedDates || solvedDates.length === 0) return 0;

  // Extract unique YYYY-MM-DD dates in UTC
  const uniqueDates = new Set();
  solvedDates.forEach(date => {
    const d = new Date(date);
    if (!isNaN(d.getTime())) {
      const year = d.getUTCFullYear();
      const month = String(d.getUTCMonth() + 1).padStart(2, '0');
      const day = String(d.getUTCDate()).padStart(2, '0');
      uniqueDates.add(`${year}-${month}-${day}`);
    }
  });

  if (uniqueDates.size === 0) return 0;

  const now = new Date();
  const formatIsoDate = (d) => {
    const year = d.getUTCFullYear();
    const month = String(d.getUTCMonth() + 1).padStart(2, '0');
    const day = String(d.getUTCDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const todayStr = formatIsoDate(now);
  const yesterday = new Date(now);
  yesterday.setUTCDate(yesterday.getUTCDate() - 1);
  const yesterdayStr = formatIsoDate(yesterday);

  let checkDate = new Date(now);
  let streak = 0;

  // Determine starting point: today or yesterday
  if (uniqueDates.has(todayStr)) {
    checkDate = new Date(now);
  } else if (uniqueDates.has(yesterdayStr)) {
    checkDate = yesterday;
  } else {
    return 0; // Streak broken
  }

  while (true) {
    const dateStr = formatIsoDate(checkDate);
    if (uniqueDates.has(dateStr)) {
      streak++;
      checkDate.setUTCDate(checkDate.getUTCDate() - 1);
    } else {
      break;
    }
  }

  return streak;
};

// GET /api/progress - overall progress dashboard
router.get('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;

    // 1. Get total problems and difficulty breakdown
    const [allProblems, allTopics, userProgressList, userBookmarksCount] = await Promise.all([
      Problem.find().select('_id topic_id difficulty title').lean(),
      Topic.find().sort({ order_index: 1 }).lean(),
      UserProgress.find({ user_id: userId, solved: true })
        .populate('problem_id', 'title difficulty topic_id')
        .sort({ solved_at: -1 })
        .lean(),
      Bookmark.countDocuments({ user_id: userId })
    ]);

    const totalProblems = allProblems.length;
    const solvedCount = userProgressList.length;
    const remainingCount = Math.max(0, totalProblems - solvedCount);
    const overallPercentage = totalProblems > 0 ? Math.round((solvedCount / totalProblems) * 100) : 0;

    // Difficulty breakdown
    const difficultyMap = {
      Easy: { total: 0, solved: 0 },
      Medium: { total: 0, solved: 0 },
      Hard: { total: 0, solved: 0 }
    };

    allProblems.forEach(p => {
      if (difficultyMap[p.difficulty]) {
        difficultyMap[p.difficulty].total++;
      }
    });

    const solvedProblemIdSet = new Set();
    const solvedDates = [];

    userProgressList.forEach(up => {
      if (up.problem_id) {
        solvedProblemIdSet.add(up.problem_id._id.toString());
        const diff = up.problem_id.difficulty;
        if (difficultyMap[diff]) {
          difficultyMap[diff].solved++;
        }
      }
      if (up.solved_at) {
        solvedDates.push(up.solved_at);
      }
    });

    // Topic breakdown and topics completed count
    const topicProblemMap = {};
    allProblems.forEach(p => {
      const tId = p.topic_id.toString();
      topicProblemMap[tId] = (topicProblemMap[tId] || 0) + 1;
    });

    const topicSolvedMap = {};
    userProgressList.forEach(up => {
      if (up.problem_id && up.problem_id.topic_id) {
        const tId = up.problem_id.topic_id.toString();
        topicSolvedMap[tId] = (topicSolvedMap[tId] || 0) + 1;
      }
    });

    let completedTopicsCount = 0;
    const topicProgress = allTopics.map(topic => {
      const tId = topic._id.toString();
      const topicTotal = topicProblemMap[tId] || 0;
      const topicSolved = topicSolvedMap[tId] || 0;
      const topicPercent = topicTotal > 0 ? Math.round((topicSolved / topicTotal) * 100) : 0;

      if (topicTotal > 0 && topicSolved >= topicTotal) {
        completedTopicsCount++;
      }

      return {
        id: topic._id,
        name: topic.name,
        slug: topic.slug,
        order_index: topic.order_index,
        total: topicTotal,
        solved: topicSolved,
        percentage: topicPercent
      };
    });

    // Streak
    const currentStreak = calculateStreak(solvedDates);

    // Recent solved problems (up to 6)
    const recentSolved = userProgressList.slice(0, 6).map(up => ({
      id: up.problem_id?._id,
      title: up.problem_id?.title || 'Problem',
      difficulty: up.problem_id?.difficulty || 'Medium',
      solved_at: up.solved_at
    })).filter(p => p.id != null);

    return res.json({
      overall: {
        total: totalProblems,
        solved: solvedCount,
        remaining: remainingCount,
        percentage: overallPercentage,
        streak: currentStreak,
        topics_completed: completedTopicsCount,
        total_topics: allTopics.length,
        bookmarks_count: userBookmarksCount
      },
      difficulty: difficultyMap,
      topics: topicProgress,
      recent_solved: recentSolved
    });
  } catch (error) {
    console.error('Error fetching progress:', error);
    return res.status(500).json({ message: 'Error retrieving progress.' });
  }
});

// GET /api/progress/:topicId - detailed topic progress
router.get('/:topicId', authMiddleware, async (req, res) => {
  try {
    const { topicId } = req.params;
    let topic;

    if (topicId.match(/^[0-9a-fA-F]{24}$/)) {
      topic = await Topic.findById(topicId);
    } else {
      topic = await Topic.findOne({ slug: topicId.toLowerCase() });
    }

    if (!topic) {
      return res.status(404).json({ message: 'Topic not found.' });
    }

    const problems = await Problem.find({ topic_id: topic._id }).lean();
    const problemIds = problems.map(p => p._id);

    const userProgressList = await UserProgress.find({
      user_id: req.userId,
      problem_id: { $in: problemIds },
      solved: true
    }).lean();

    const solvedSet = new Set(userProgressList.map(up => up.problem_id.toString()));

    const difficultyMap = {
      Easy: { total: 0, solved: 0 },
      Medium: { total: 0, solved: 0 },
      Hard: { total: 0, solved: 0 }
    };

    problems.forEach(p => {
      if (difficultyMap[p.difficulty]) {
        difficultyMap[p.difficulty].total++;
        if (solvedSet.has(p._id.toString())) {
          difficultyMap[p.difficulty].solved++;
        }
      }
    });

    const total = problems.length;
    const solved = solvedSet.size;
    const remaining = Math.max(0, total - solved);
    const percentage = total > 0 ? Math.round((solved / total) * 100) : 0;

    return res.json({
      topic: {
        id: topic._id,
        name: topic.name,
        slug: topic.slug,
        total,
        solved,
        remaining,
        percentage
      },
      difficulty: difficultyMap
    });
  } catch (error) {
    console.error('Error fetching topic progress:', error);
    return res.status(500).json({ message: 'Error retrieving topic progress.' });
  }
});

module.exports = router;
