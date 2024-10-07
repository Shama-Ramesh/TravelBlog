// controllers/reportController.js
const Report = require('../model/report_model');
const Blog=require('../model/blog_model')
const UserSchema=require('../model/user_model')

// Submit a report
const submitReport = async (req, res) => {
  try {
    const { blogId, reason } = req.body;
    const userId = req.user; // Assuming user ID is available in req.user

    const newReport = new Report({
      blogId,
      userId,
      reason,
      
    });

    await newReport.save();
    res.status(201).json({ message: 'Report submitted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error submitting report', error });
  }
};

// Get all reports (for admin use)
const getReports = async (req, res) => {
  try {
    const reports = await Report.find().populate('blogId').populate('userId');
    res.status(200).json(reports);
  
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving reports', error });
  }
};

const deleteBlogReport = async (req, res) => {
    try {
      const blogId = req.params.blogId;
   
      const report_id = req.params.reportId;
      console.log(blogId,"hh");
      console.log(report_id,"hh");
      if(blogId){
        await Blog.findByIdAndDelete(blogId);

      }
     
      await Report.findByIdAndDelete(report_id)
      res.status(200).json({ message: "Blog deleted successfully" });
    } catch (error) {
      console.error("Error deleting blog:", error);
      res.status(500).json({ message: "Failed to delete blog" });
    }
  };


  const getCount = async (req, res) => {
    try {
      const blogCount = await Blog.countDocuments();
      const userCount = await UserSchema.countDocuments();
      const reportCount = await Report.countDocuments();
  
      res.status(200).json({
        totalBlogs: blogCount,
        totalUsers: userCount,
        totalReports: reportCount
      });
    } catch (error) {
      console.error('Error fetching counts:', error);
      res.status(500).json({ message: 'Error fetching counts', error });
    }
  };

module.exports={submitReport,getReports,deleteBlogReport,getCount}
