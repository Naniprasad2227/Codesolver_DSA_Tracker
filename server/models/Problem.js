const mongoose = require('mongoose');

const problemSchema = new mongoose.Schema({
  topic_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Topic',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  difficulty: {
    type: String,
    required: true,
    enum: ['Easy', 'Medium', 'Hard']
  },
  leetcode_url: {
    type: String,
    default: null
  },
  gfg_url: {
    type: String,
    default: null
  },
  order_index: {
    type: Number,
    required: true
  }
});

problemSchema.index({ topic_id: 1, order_index: 1 });

module.exports = mongoose.model('Problem', problemSchema);
