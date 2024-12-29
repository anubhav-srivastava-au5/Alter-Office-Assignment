const express = require('express');
const { getUrlAnalytics,getTopicAnalytics,getOverallAnalytics } = require('../controllers/analyticsController');
const router = express.Router();
const authenticate=require("../middleware/authenticate");

router.get('/analytics/overall',authenticate, getOverallAnalytics);
router.get('/analytics/:alias', getUrlAnalytics);
router.get('/analytics/topic/:topic', getTopicAnalytics);


module.exports = router;