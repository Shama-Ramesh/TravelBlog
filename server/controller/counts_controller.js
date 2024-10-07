
const Blog = require('../model/blog_model');
const User = require('../model/user_model');



// Get recent posts
const RecentPost=async(req, res) => {
  try {
    console.log("gg");
    const recentPosts = await Blog.find().sort({ createdAt: -1 }).limit(5).select(['title','createdAt']);
    res.json(recentPosts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Get recent comments
const RecentComment = async (req, res) => {
    try {
      // Step 1: Perform the aggregation to get the recent comments
      const recentComments = await Blog.aggregate([
        { $unwind: '$comments' },
        { $sort: { 'comments.createdAt': -1 } },
        { $limit: 5 },
        { $project: { 'comments.author': 1, 'comments.text': 1 ,'comments.createdAt':1} }
      ]);
  
      // Step 2: Extract comment IDs for population
      const commentUserIds = recentComments.map(comment => comment._id);
  
      // Step 3: Populate user data
      const populatedComments = await Blog.populate(recentComments, {
        path: 'comments.author',
    
      });
  
      res.json(populatedComments);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

// Get popular destinations
const Destination = async (req, res) => {
    try {
      const popularDestinations = await Blog.aggregate([
        { $group: { _id: '$subcategory', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 }
      ]);
      res.json(popularDestinations);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

// Get user demographics
const UserDemographics=async (req, res) => {
  try {
    const demographics = await User.aggregate([
      {
        $bucket: {
          groupBy: '$age',
          boundaries: [18, 25, 35, 45, 100],
          default: 'Other',
          output: {
            count: { $sum: 1 }
          }
        }
      }
    ]);
    res.json(demographics);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = {RecentComment,RecentPost,Destination,UserDemographics}
