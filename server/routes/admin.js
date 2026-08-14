const express = require('express');
const User = require('../models/User');
const Problem = require('../models/Problem');
const Topic = require('../models/Topic');
const UserProgress = require('../models/UserProgress');
const Bookmark = require('../models/Bookmark');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

const router = express.Router();

// Apply auth + admin guard to all admin routes
router.use(authMiddleware, adminMiddleware);

// GET /api/admin/stats - Global Platform Metrics
router.get('/stats', async (req, res) => {
  try {
    const [
      totalUsers,
      totalProblems,
      totalTopics,
      totalSolves,
      recentUsers,
      topSolvedProblems
    ] = await Promise.all([
      User.countDocuments(),
      Problem.countDocuments(),
      Topic.countDocuments(),
      UserProgress.countDocuments({ solved: true }),
      User.find().sort({ created_at: -1 }).limit(5).select('name email role created_at').lean(),
      UserProgress.aggregate([
        { $match: { solved: true } },
        { $group: { _id: '$problem_id', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 6 },
        {
          $lookup: {
            from: 'problems',
            localField: '_id',
            foreignField: '_id',
            as: 'problem'
          }
        },
        { $unwind: '$problem' },
        {
          $project: {
            id: '$_id',
            title: '$problem.title',
            difficulty: '$problem.difficulty',
            solves: '$count'
          }
        }
      ])
    ]);

    const avgSolvesPerUser = totalUsers > 0 ? (totalSolves / totalUsers).toFixed(1) : 0;

    return res.json({
      metrics: {
        total_users: totalUsers,
        total_problems: totalProblems,
        total_topics: totalTopics,
        total_solves: totalSolves,
        avg_solves_per_user: avgSolvesPerUser
      },
      recent_users: recentUsers,
      top_solved_problems: topSolvedProblems
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    return res.status(500).json({ message: 'Failed to retrieve admin stats.' });
  }
});

// GET /api/admin/users - User Management list with stats
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().sort({ created_at: -1 }).lean();

    const userStats = await UserProgress.aggregate([
      { $match: { solved: true } },
      {
        $group: {
          _id: '$user_id',
          solved_count: { $sum: 1 }
        }
      }
    ]);

    const solveMap = {};
    userStats.forEach(s => {
      solveMap[s._id.toString()] = s.solved_count;
    });

    const formattedUsers = users.map(u => ({
      id: u._id,
      name: u.name,
      email: u.email,
      role: u.role || 'user',
      created_at: u.created_at,
      solved_count: solveMap[u._id.toString()] || 0
    }));

    return res.json({ users: formattedUsers });
  } catch (error) {
    console.error('Admin users error:', error);
    return res.status(500).json({ message: 'Failed to retrieve users.' });
  }
});

// PUT /api/admin/users/:userId/role - Promote/Demote user
router.put('/users/:userId/role', async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role specified.' });
    }

    const updated = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true }
    ).select('name email role');

    if (!updated) {
      return res.status(404).json({ message: 'User not found.' });
    }

    return res.json({ message: 'User role updated successfully.', user: updated });
  } catch (error) {
    console.error('Admin update role error:', error);
    return res.status(500).json({ message: 'Failed to update user role.' });
  }
});

// DELETE /api/admin/users/:userId - Delete user and cascade delete progress & bookmarks
router.delete('/users/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    if (userId === req.userId) {
      return res.status(400).json({ message: 'You cannot delete your own admin account.' });
    }

    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Cascade delete user data
    await Promise.all([
      UserProgress.deleteMany({ user_id: userId }),
      Bookmark.deleteMany({ user_id: userId })
    ]);

    return res.json({ message: `User "${user.name}" and all associated progress have been deleted.` });
  } catch (error) {
    console.error('Admin delete user error:', error);
    return res.status(500).json({ message: 'Failed to delete user.' });
  }
});

// POST /api/admin/problems - Create new problem
router.post('/problems', async (req, res) => {
  try {
    const { topic_id, title, difficulty, leetcode_url, gfg_url, order_index } = req.body;

    if (!topic_id || !title || !difficulty) {
      return res.status(400).json({ message: 'Topic, title, and difficulty are required.' });
    }

    const nextOrder = order_index || (await Problem.countDocuments({ topic_id })) + 1;

    const newProblem = new Problem({
      topic_id,
      title: title.trim(),
      difficulty,
      leetcode_url: leetcode_url ? leetcode_url.trim() : null,
      gfg_url: gfg_url ? gfg_url.trim() : null,
      order_index: nextOrder
    });

    await newProblem.save();

    return res.status(201).json({ message: 'Problem created successfully.', problem: newProblem });
  } catch (error) {
    console.error('Admin create problem error:', error);
    return res.status(500).json({ message: 'Failed to create problem.' });
  }
});

// PUT /api/admin/problems/:problemId - Update existing problem
router.put('/problems/:problemId', async (req, res) => {
  try {
    const { problemId } = req.params;
    const { topic_id, title, difficulty, leetcode_url, gfg_url, order_index } = req.body;

    const updateFields = {};
    if (topic_id) updateFields.topic_id = topic_id;
    if (title) updateFields.title = title.trim();
    if (difficulty) updateFields.difficulty = difficulty;
    if (leetcode_url !== undefined) updateFields.leetcode_url = leetcode_url ? leetcode_url.trim() : null;
    if (gfg_url !== undefined) updateFields.gfg_url = gfg_url ? gfg_url.trim() : null;
    if (order_index !== undefined) updateFields.order_index = order_index;

    const updated = await Problem.findByIdAndUpdate(problemId, updateFields, { new: true });
    if (!updated) {
      return res.status(404).json({ message: 'Problem not found.' });
    }

    return res.json({ message: 'Problem updated successfully.', problem: updated });
  } catch (error) {
    console.error('Admin update problem error:', error);
    return res.status(500).json({ message: 'Failed to update problem.' });
  }
});

// DELETE /api/admin/problems/:problemId - Delete problem
router.delete('/problems/:problemId', async (req, res) => {
  try {
    const { problemId } = req.params;

    const problem = await Problem.findByIdAndDelete(problemId);
    if (!problem) {
      return res.status(404).json({ message: 'Problem not found.' });
    }

    // Cascade delete progress and bookmarks for this problem
    await Promise.all([
      UserProgress.deleteMany({ problem_id: problemId }),
      Bookmark.deleteMany({ problem_id: problemId })
    ]);

    return res.json({ message: `Problem "${problem.title}" deleted.` });
  } catch (error) {
    console.error('Admin delete problem error:', error);
    return res.status(500).json({ message: 'Failed to delete problem.' });
  }
});

module.exports = router;
