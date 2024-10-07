const mongoose = require('mongoose');
const { Schema } = mongoose;

const bookmarkSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  blog: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'blog',
    required: true
  },
  createdAt: { type: Date, default: Date.now }
});

const Bookmark = mongoose.model('Bookmark', bookmarkSchema);

module.exports = Bookmark;
