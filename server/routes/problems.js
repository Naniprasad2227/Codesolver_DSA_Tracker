const express = require('express');
const Problem = require('../models/Problem');
const Topic = require('../models/Topic');
const UserProgress = require('../models/UserProgress');
const Bookmark = require('../models/Bookmark');
const { authMiddleware, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Helper to get problem list formatted with user solved/bookmarked state
const formatProblemsWithUserState = async (problems, userId) => {
  let solvedProblemIds = new Set();
  let bookmarkedProblemIds = new Set();

  if (userId) {
    const [progressDocs, bookmarkDocs] = await Promise.all([
      UserProgress.find({ user_id: userId, solved: true }).select('problem_id'),
      Bookmark.find({ user_id: userId }).select('problem_id')
    ]);

    solvedProblemIds = new Set(progressDocs.map(p => p.problem_id.toString()));
    bookmarkedProblemIds = new Set(bookmarkDocs.map(b => b.problem_id.toString()));
  }

  return problems.map(prob => ({
    id: prob._id,
    title: prob.title,
    difficulty: prob.difficulty,
    leetcode_url: prob.leetcode_url,
    gfg_url: prob.gfg_url,
    order_index: prob.order_index,
    topic: prob.topic_id ? {
      id: prob.topic_id._id || prob.topic_id,
      name: prob.topic_id.name,
      slug: prob.topic_id.slug
    } : null,
    is_solved: solvedProblemIds.has(prob._id.toString()),
    is_bookmarked: bookmarkedProblemIds.has(prob._id.toString())
  }));
};

// GET /api/problems - all problems with filters and optional user state
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { topic, difficulty, status, platform, search, sort } = req.query;

    let filter = {};

    // Topic filter
    if (topic && topic !== 'All') {
      if (topic.match(/^[0-9a-fA-F]{24}$/)) {
        filter.topic_id = topic;
      } else {
        const foundTopic = await Topic.findOne({ slug: topic.toLowerCase() });
        if (foundTopic) {
          filter.topic_id = foundTopic._id;
        }
      }
    }

    // Difficulty filter
    if (difficulty && difficulty !== 'All') {
      filter.difficulty = difficulty;
    }

    // Platform filter
    if (platform === 'LeetCode') {
      filter.leetcode_url = { $ne: null, $exists: true };
    } else if (platform === 'GFG') {
      filter.gfg_url = { $ne: null, $exists: true };
    }

    // Search filter
    if (search && search.trim()) {
      filter.title = { $regex: search.trim(), $options: 'i' };
    }

    let problems = await Problem.find(filter)
      .populate('topic_id', 'name slug order_index')
      .sort({ 'topic_id.order_index': 1, order_index: 1 })
      .lean();

    let formatted = await formatProblemsWithUserState(problems, req.userId);

    // Status filter (Solved / Unsolved)
    if (status === 'Solved') {
      formatted = formatted.filter(p => p.is_solved);
    } else if (status === 'Unsolved') {
      formatted = formatted.filter(p => !p.is_solved);
    }

    // Sorting
    if (sort === 'Alphabetical') {
      formatted.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sort === 'EasyToHard') {
      const order = { Easy: 1, Medium: 2, Hard: 3 };
      formatted.sort((a, b) => (order[a.difficulty] || 0) - (order[b.difficulty] || 0));
    } else if (sort === 'HardToEasy') {
      const order = { Easy: 1, Medium: 2, Hard: 3 };
      formatted.sort((a, b) => (order[b.difficulty] || 0) - (order[a.difficulty] || 0));
    } else if (sort === 'SolvedFirst') {
      formatted.sort((a, b) => (b.is_solved === a.is_solved ? 0 : b.is_solved ? 1 : -1));
    } else if (sort === 'UnsolvedFirst') {
      formatted.sort((a, b) => (a.is_solved === b.is_solved ? 0 : a.is_solved ? 1 : -1));
    }

    return res.json({
      total: formatted.length,
      problems: formatted
    });
  } catch (error) {
    console.error('Error fetching problems:', error);
    return res.status(500).json({ message: 'Error retrieving problems.' });
  }
});

// GET /api/topics/:topicId/problems
router.get('/topic/:topicId', optionalAuth, async (req, res) => {
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

    const problems = await Problem.find({ topic_id: topic._id })
      .sort({ order_index: 1 })
      .lean();

    const formatted = await formatProblemsWithUserState(problems, req.userId);

    return res.json({
      topic: {
        id: topic._id,
        name: topic.name,
        slug: topic.slug
      },
      total: formatted.length,
      problems: formatted
    });
  } catch (error) {
    console.error('Error fetching topic problems:', error);
    return res.status(500).json({ message: 'Error retrieving topic problems.' });
  }
});

// POST /api/problems/:problemId/complete - Mark problem solved
router.post('/:problemId/complete', authMiddleware, async (req, res) => {
  try {
    const { problemId } = req.params;

    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({ message: 'Problem not found.' });
    }

    // Upsert user progress record
    const progress = await UserProgress.findOneAndUpdate(
      { user_id: req.userId, problem_id: problem._id },
      { solved: true, solved_at: new Date() },
      { upsert: true, new: true }
    );

    return res.json({
      message: 'Problem marked as solved.',
      problem_id: problem._id,
      is_solved: true,
      solved_at: progress.solved_at
    });
  } catch (error) {
    console.error('Error completing problem:', error);
    return res.status(500).json({ message: 'Error updating problem progress.' });
  }
});

// DELETE /api/problems/:problemId/complete - Unsolve problem
router.delete('/:problemId/complete', authMiddleware, async (req, res) => {
  try {
    const { problemId } = req.params;

    await UserProgress.findOneAndDelete({
      user_id: req.userId,
      problem_id: problemId
    });

    return res.json({
      message: 'Problem marked as unsolved.',
      problem_id: problemId,
      is_solved: false
    });
  } catch (error) {
    console.error('Error unsolving problem:', error);
    return res.status(500).json({ message: 'Error updating problem progress.' });
  }
});

// POST /api/problems/:problemId/bookmark - Add bookmark
router.post('/:problemId/bookmark', authMiddleware, async (req, res) => {
  try {
    const { problemId } = req.params;

    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({ message: 'Problem not found.' });
    }

    await Bookmark.findOneAndUpdate(
      { user_id: req.userId, problem_id: problem._id },
      { created_at: new Date() },
      { upsert: true, new: true }
    );

    return res.json({
      message: 'Added to bookmarks.',
      problem_id: problem._id,
      is_bookmarked: true
    });
  } catch (error) {
    console.error('Error adding bookmark:', error);
    return res.status(500).json({ message: 'Error saving bookmark.' });
  }
});

// DELETE /api/problems/:problemId/bookmark - Remove bookmark
router.delete('/:problemId/bookmark', authMiddleware, async (req, res) => {
  try {
    const { problemId } = req.params;

    await Bookmark.findOneAndDelete({
      user_id: req.userId,
      problem_id: problemId
    });

    return res.json({
      message: 'Removed from bookmarks.',
      problem_id: problemId,
      is_bookmarked: false
    });
  } catch (error) {
    console.error('Error removing bookmark:', error);
    return res.status(500).json({ message: 'Error removing bookmark.' });
  }
});

// GET /api/problems/bookmarks/list - Get all bookmarks for user
router.get('/user/bookmarks', authMiddleware, async (req, res) => {
  try {
    const bookmarkDocs = await Bookmark.find({ user_id: req.userId })
      .sort({ created_at: -1 })
      .populate({
        path: 'problem_id',
        populate: { path: 'topic_id', select: 'name slug' }
      })
      .lean();

    const problems = bookmarkDocs
      .filter(b => b.problem_id != null)
      .map(b => b.problem_id);

    const formatted = await formatProblemsWithUserState(problems, req.userId);

    return res.json({
      total: formatted.length,
      problems: formatted
    });
  } catch (error) {
    console.error('Error fetching bookmarks:', error);
    return res.status(500).json({ message: 'Error retrieving bookmarks.' });
  }
});

module.exports = router;
