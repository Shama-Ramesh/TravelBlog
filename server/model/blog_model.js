// models/blogModel.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const commentSchema = new Schema({
  author: {type: mongoose.Schema.Types.ObjectId,
    ref: 'user', required: true },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const blogSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  category: { type: String, required: true },
  subcategory: { type: String, required: true },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  images: [{ type: String }], // Array of image URLs or paths
  videos: [{ type: String }], // Array of video URLs or paths
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }], // Number of likes
  comments: [commentSchema], // Array of comments
  views: { type: Number, default: 0 }, // Number of views
},{timestamps:true});

const Blog = mongoose.model('blog', blogSchema);

module.exports = Blog;
