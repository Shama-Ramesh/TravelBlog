// models/Report.js
const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  blogId: { type: mongoose.Schema.Types.ObjectId, ref: 'blog', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
  reason: { type: String, required: true },

},{timestamps:true});

const Report = mongoose.model('Report', reportSchema);

module.exports = Report;
