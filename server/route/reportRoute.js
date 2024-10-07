// routes/reportRoutes.js
const express = require('express');
const router = express.Router();

const fetchAdmin = require('../middleware/authenticateToken');
const { submitReport, getReports, deleteBlogReport, getCount } = require('../controller/report_controller');
const { FeedbackInsert, GetAllFeedbackDetails } = require('../controller/feedback_controller');

// Submit a report
router.post('/report',fetchAdmin,submitReport);
router.post('/insert-feed',fetchAdmin,FeedbackInsert);
router.get('/all-feed',GetAllFeedbackDetails);
router.get('/all',getCount);
router.delete('/delete/:blogId/:reportId',deleteBlogReport);

// Get all reports (optional, for admin use)
router.get('/reports', getReports);


module.exports = router;
