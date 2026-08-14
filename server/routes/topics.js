const express = require('express');
const Topic = require('../models/Topic');
const Problem = require('../models/Problem');
const UserProgress = require('../models/UserProgress');
const { authMiddleware, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// GET /api/topics - all topics with user-specific progress
router.get('/', optionalAuth, async (req, res) => {
  try {
    const topics = await Topic.find().sort({ order_index: 1 }).lean();

    // Get total problem count per topic
    const topicProblemCounts = await Problem.aggregate([
      {
        $group: {
          _id: '$topic_id',
          total: { $sum: 1 }
        }
      }
    ]);

    const countMap = {};
    topicProblemCounts.forEach(t => {
      countMap[t._id.toString()] = t.total;
    });

    let userSolvedMap = {};
    if (req.userId) {
      // Find all solved problems for this user
      const solvedProgress = await UserProgress.find({
        user_id: req.userId,
        solved: true
      }).populate('problem_id', 'topic_id').lean();

      solvedProgress.forEach(up => {
        if (up.problem_id && up.problem_id.topic_id) {
          const tId = up.problem_id.topic_id.toString();
          userSolvedMap[tId] = (userSolvedMap[tId] || 0) + 1;
        }
      });
    }

    const topicsWithProgress = topics.map(topic => {
      const topicIdStr = topic._id.toString();
      const totalProblems = countMap[topicIdStr] || 0;
      const solvedCount = userSolvedMap[topicIdStr] || 0;
      const percentage = totalProblems > 0 ? Math.round((solvedCount / totalProblems) * 100) : 0;

      return {
        id: topic._id,
        name: topic.name,
        slug: topic.slug,
        order_index: topic.order_index,
        total_problems: totalProblems,
        solved_count: solvedCount,
        percentage
      };
    });

    return res.json({ topics: topicsWithProgress });
  } catch (error) {
    console.error('Error fetching topics:', error);
    return res.status(500).json({ message: 'Error retrieving topics.' });
  }
});

// GET /api/topics/:topicId - single topic by ID or Slug
router.get('/:topicId', optionalAuth, async (req, res) => {
  try {
    const { topicId } = req.params;
    let topic;

    if (topicId.match(/^[0-9a-fA-F]{24}$/)) {
      topic = await Topic.findById(topicId).lean();
    } else {
      topic = await Topic.findOne({ slug: topicId.toLowerCase() }).lean();
    }

    if (!topic) {
      return res.status(404).json({ message: 'Topic not found.' });
    }

    const totalProblems = await Problem.countDocuments({ topic_id: topic._id });

    let solvedCount = 0;
    if (req.userId) {
      const topicProblems = await Problem.find({ topic_id: topic._id }).select('_id');
      const problemIds = topicProblems.map(p => p._id);
      solvedCount = await UserProgress.countDocuments({
        user_id: req.userId,
        problem_id: { $in: problemIds },
        solved: true
      });
    }

    const percentage = totalProblems > 0 ? Math.round((solvedCount / totalProblems) * 100) : 0;

    return res.json({
      topic: {
        id: topic._id,
        name: topic.name,
        slug: topic.slug,
        order_index: topic.order_index,
        total_problems: totalProblems,
        solved_count: solvedCount,
        percentage
      }
    });
  } catch (error) {
    console.error('Error fetching topic:', error);
    return res.status(500).json({ message: 'Error retrieving topic.' });
  }
});

module.exports = router;
