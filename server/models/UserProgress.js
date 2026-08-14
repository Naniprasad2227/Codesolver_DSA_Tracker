const mongoose = require('mongoose');

const userProgressSchema = new mongoose.Schema({
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
  solved: {
    type: Boolean,
    default: true
  },
  solved_at: {
    type: Date,
    default: Date.now
  }
});

userProgressSchema.index({ user_id: 1, problem_id: 1 }, { unique: true });
userProgressSchema.index({ user_id: 1, solved_at: -1 });

module.exports = mongoose.model('UserProgress', userProgressSchema);
