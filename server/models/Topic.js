const mongoose = require('mongoose');

const topicSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  order_index: {
    type: Number,
    required: true
  }
});

topicSchema.index({ order_index: 1 });

module.exports = mongoose.model('Topic', topicSchema);
