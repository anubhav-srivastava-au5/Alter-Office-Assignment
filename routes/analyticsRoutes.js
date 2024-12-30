// const express = require('express');
// const { getUrlAnalytics,getTopicAnalytics,getOverallAnalytics } = require('../controllers/analyticsController');
// const router = express.Router();
// const authenticate=require("../middleware/authenticate");

// router.get('/analytics/overall',authenticate, getOverallAnalytics);  
// router.get('/analytics/:alias', getUrlAnalytics);
// router.get('/analytics/topic/:topic', getTopicAnalytics);


// module.exports = router;





/**
 * @swagger
 * tags:
 *   name: Analytics
 *   description: Endpoints for retrieving analytics data
 */

const express = require('express');
const { getUrlAnalytics, getTopicAnalytics, getOverallAnalytics } = require('../controllers/analyticsController');
const router = express.Router();
const authenticate = require("../middleware/authenticate");

/**
 * @swagger
 * /analytics/overall:
 *   get:
 *     summary: Get overall analytics
 *     description: Retrieve overall analytics for all short URLs created by the authenticated user.
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Overall analytics retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalUrls:
 *                   type: number
 *                 totalClicks:
 *                   type: number
 *                 uniqueUsers:
 *                   type: number
 *                 clicksByDate:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       date:
 *                         type: string
 *                         format: date
 *                       count:
 *                         type: number
 *                 osType:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       osName:
 *                         type: string
 *                       uniqueClicks:
 *                         type: number
 *                       uniqueUsers:
 *                         type: number
 *                 deviceType:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       deviceName:
 *                         type: string
 *                       uniqueClicks:
 *                         type: number
 *                       uniqueUsers:
 *                         type: number
 *       401:
 *         description: Unauthorized
 */
router.get('/analytics/overall', authenticate, getOverallAnalytics);

/**
 * @swagger
 * /analytics/{alias}:
 *   get:
 *     summary: Get analytics for a specific URL
 *     description: Retrieve detailed analytics for a specific short URL, including clicks, unique users, and more.
 *     tags: [Analytics]
 *     parameters:
 *       - in: path
 *         name: alias
 *         required: true
 *         schema:
 *           type: string
 *         description: The alias of the short URL
 *     responses:
 *       200:
 *         description: URL analytics retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalClicks:
 *                   type: number
 *                 uniqueUsers:
 *                   type: number
 *                 clicksByDate:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       date:
 *                         type: string
 *                         format: date
 *                       count:
 *                         type: number
 *                 osType:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       osName:
 *                         type: string
 *                       uniqueClicks:
 *                         type: number
 *                       uniqueUsers:
 *                         type: number
 *                 deviceType:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       deviceName:
 *                         type: string
 *                       uniqueClicks:
 *                         type: number
 *                       uniqueUsers:
 *                         type: number
 *       404:
 *         description: URL not found
 */
router.get('/analytics/:alias', getUrlAnalytics);

/**
 * @swagger
 * /analytics/topic/{topic}:
 *   get:
 *     summary: Get analytics for a specific topic
 *     description: Retrieve analytics for all short URLs grouped under a specific topic.
 *     tags: [Analytics]
 *     parameters:
 *       - in: path
 *         name: topic
 *         required: true
 *         schema:
 *           type: string
 *         description: The topic for which analytics is retrieved
 *     responses:
 *       200:
 *         description: Topic analytics retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalClicks:
 *                   type: number
 *                 uniqueUsers:
 *                   type: number
 *                 clicksByDate:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       date:
 *                         type: string
 *                         format: date
 *                       count:
 *                         type: number
 *                 urls:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       shortUrl:
 *                         type: string
 *                       totalClicks:
 *                         type: number
 *                       uniqueUsers:
 *                         type: number
 *       404:
 *         description: Topic not found
 */
router.get('/analytics/topic/:topic', getTopicAnalytics);

module.exports = router;
