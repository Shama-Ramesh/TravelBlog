const Blog = require('../model/blog_model');

// Add a new comment to a blog
const addComment = async (req, res) => {
    console.log("jkl");
  try {
    const { text } = req.body;
    let  blogId=req.params.id
    const userId = req.user; // Assuming user information is available in req.user

    // Find the blog by ID
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    // Create a new comment
    const newComment = {
      author: userId, // Or username if you prefer
      text,
      createdAt: Date.now()
    };

    // Add the comment to the blog
    blog.comments.push(newComment);
    await blog.save();

    res.status(200).json({ message: 'Comment added successfully', comment: newComment });
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ message: 'Failed to add comment' });
  }
};

// Get all comments for a blog
const getComments = async (req, res) => {
  try {
    const blogId = req.params.id;

    // Find the blog and populate the comments
    const blog = await Blog.findById(blogId).select('comments').populate({ path: 'comments.author',});
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    res.status(200).json(blog.comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ message: 'Failed to fetch comments' });
  }
};

// Optional: Update a comment
const updateComment = async (req, res) => {
  try {
    const { blogId, commentId, text } = req.body;

    // Find the blog by ID
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    // Find the comment by ID and update it
    const comment = blog.comments.id(commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    comment.text = text;
    await blog.save();

    res.status(200).json({ message: 'Comment updated successfully', comment });
  } catch (error) {
    console.error('Error updating comment:', error);
    res.status(500).json({ message: 'Failed to update comment' });
  }
};

// Optional: Delete a comment
const deleteComment = async (req, res) => {
  try {
    const { blogId, commentId } = req.params;

    // Find the blog by ID
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    // Remove the comment by ID
    const comment = blog.comments.id(commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    comment.remove();
    await blog.save();

    res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({ message: 'Failed to delete comment' });
  }
};

module.exports = {
  addComment,
  getComments,
  updateComment,
  deleteComment
};
