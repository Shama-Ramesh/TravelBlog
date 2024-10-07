// routes/blogRoutes.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const middleware = require('../middleware/authenticateToken')

const { createBlog, GetBlog,deleteBlog,updateBlog,GetUserBlog, updateViews, likeBlog} = require('../controller/blog_controller');
const fetchAdmin = require('../middleware/authenticateToken');
const { getCounts } = require('./countRoute');

const router = express.Router();



const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, file.mimetype.startsWith('image/') ? 'uploads/images' : 'uploads/videos')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, uniqueSuffix + '-' + file.originalname)
  }
})

const upload = multer({ storage: storage })

// Define the route
router.post('/insert',middleware,upload.any(), createBlog);
router.post('/views/:id',fetchAdmin, updateViews);
router.post('/likes/:id',fetchAdmin, likeBlog);
router.get('/getblog', GetBlog);
router.delete("/delete/:id", deleteBlog);
router.put("/update/:id",upload.any(), updateBlog);
router.get("/getuserblog",middleware, GetUserBlog);
// router.get("/counts",getCounts)




module.exports = router;
