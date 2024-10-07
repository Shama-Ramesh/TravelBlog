const express = require('express');
const router = express.Router();
const {
  addBookmark,
  removeBookmark,
  getBookmarks
} = require('../controller/bookmark_controller');
const fetchAdmin = require('../middleware/authenticateToken');
 // Assuming you have an auth middleware

// Add a bookmark
router.post('/bookmarks/:id', fetchAdmin, addBookmark);


// Remove a bookmark
router.delete('/delete-bookmarks/:id', fetchAdmin, removeBookmark);

// Get all bookmarks for the authenticated user
router.get('/bookmarks', fetchAdmin, getBookmarks);

module.exports = router;
