// routes/report.js
const express = require('express');
const { RecentPost, RecentComment, Destination, UserDemographics } = require('../controller/counts_controller');
const router = express.Router();




// Get recent posts
router.get('/recent-posts',RecentPost);

// Get recent comments
router.get('/recent-comments', RecentComment);

// Get popular destinations
router.get('/popular-destinations', Destination);

// Get user demographics
router.get('/user-demographics',UserDemographics
);

module.exports = router;
