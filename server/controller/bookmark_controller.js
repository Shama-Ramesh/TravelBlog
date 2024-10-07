const Bookmark = require('../model/bookmark_mdel');
const Blog = require('../model/blog_model');

// Add a bookmark
const addBookmark = async (req, res) => {
  try {

    const  blogId  = req.params.id;
    const userId = req.user; // Assuming user information is available in req.user

    // Check if the blog exists
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    // Check if the bookmark already exists
    const existingBookmark = await Bookmark.findOne({ user: userId, blog: blogId });
    if (existingBookmark) {
      return res.status(400).json({ message: 'Blog is already bookmarked' });
    }

    // Create a new bookmark
    const newBookmark = new Bookmark({
      user: userId,
      blog: blogId
    });

    await newBookmark.save();
    res.status(200).json({ message: 'Blog bookmarked successfully' });
  } catch (error) {
    console.error('Error adding bookmark:', error);
    res.status(500).json({ message: 'Failed to add bookmark' });
  }
};

// Remove a bookmark
const removeBookmark = async (req, res) => {
  
  try {

    const id  = req.params.id;
    const userId = req.user; // Assuming user information is available in req.user

    // Remove the bookmark
  
    const result = await Bookmark.findByIdAndDelete(id);
   

    if (!result) {
      return res.status(404).json({ message: 'Bookmark not found' });
    }

    res.status(200).json({ message: 'Bookmark removed successfully' });
  } catch (error) {
    console.error('Error removing bookmark:', error);
    res.status(500).json({ message: 'Failed to remove bookmark' });
  }
};

// Get all bookmarks for a user
const getBookmarks = async (req, res) => {
  try {
    const userId = req.user; // Assuming user information is available in req.user

    // Find all bookmarks for the user
    const bookmarks = await Bookmark.find({ user: userId }).populate('blog');
  

    res.status(200).json(bookmarks);
  } catch (error) {
    console.error('Error fetching bookmarks:', error);
    res.status(500).json({ message: 'Failed to fetch bookmarks' });
  }
};

module.exports = {
  addBookmark,
  removeBookmark,
  getBookmarks
};
