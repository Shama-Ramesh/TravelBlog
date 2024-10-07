const express = require('express');
const router = express.Router();
const {
  addComment,
  getComments,
  updateComment,
  deleteComment
} = require('../controller/comment_controller');
const fetchAdmin = require('../middleware/authenticateToken');
// Assuming you have an auth middleware

// Add a new comment
router.post('/comments/:id', fetchAdmin, addComment);

// Get comments for a blog
router.get('/blogs/comments/:id', getComments);

// Update a comment
router.put('/blogs/:blogId/comments/:commentId', fetchAdmin, updateComment);

// Delete a comment
router.delete('/blogs/:blogId/comments/:commentId', fetchAdmin, deleteComment);

module.exports = router;
