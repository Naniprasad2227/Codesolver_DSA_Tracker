const mongoose = require('mongoose');

const bookmarkSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  problem_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Problem',
    required: true
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

bookmarkSchema.index({ user_id: 1, problem_id: 1 }, { unique: true });

module.exports = mongoose.model('Bookmark', bookmarkSchema);
