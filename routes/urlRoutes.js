// const express = require('express');
// const { createShortUrl, redirectToLongUrl } = require('../controllers/urlController');
// const router = express.Router();
// const authenticate=require("../middleware/authenticate");


// router.post('/api/shorten',authenticate, createShortUrl);
// router.get('/api/shorten/:shortUrl', redirectToLongUrl);

// module.exports = router;















/**
 * @swagger
 * tags:
 *   name: URL Shortener
 *   description: Endpoints for creating and managing short URLs
 */

const express = require('express');
const { createShortUrl, redirectToLongUrl } = require('../controllers/urlController');
const router = express.Router();
const authenticate = require('../middleware/authenticate');

/**
 * @swagger
 * /api/shorten:
 *   post:
 *     summary: Create a short URL
 *     description: Generates a short URL for the provided long URL. Users must be authenticated.
 *     tags: [URL Shortener]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               longUrl:
 *                 type: string
 *                 description: The original URL to be shortened.
 *                 example: https://example.com/some/long/url
 *               customAlias:
 *                 type: string
 *                 description: A custom alias for the short URL (optional).
 *                 example: my-custom-alias
 *               topic:
 *                 type: string
 *                 description: A topic or category for the URL (optional).
 *                 example: marketing
 *     responses:
 *       201:
 *         description: Successfully created a short URL.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 shortUrl:
 *                   type: string
 *                   description: The generated short URL.
 *                   example: https://short.ly/abc123
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   description: The timestamp when the URL was created.
 *       400:
 *         description: Invalid input data.
 *       401:
 *         description: Unauthorized (authentication required).
 */
router.post('/api/shorten', authenticate, createShortUrl);

/**
 * @swagger
 * /api/shorten/{shortUrl}:
 *   get:
 *     summary: Redirect to the original URL
 *     description: Redirects to the original URL based on the provided short URL.
 *     tags: [URL Shortener]
 *     parameters:
 *       - in: path
 *         name: shortUrl
 *         required: true
 *         schema:
 *           type: string
 *         description: The short URL alias.
 *         example: abc123
 *     responses:
 *       302:
 *         description: Redirects to the original URL.
 *       404:
 *         description: Short URL not found.
 */
router.get('/api/shorten/:shortUrl', redirectToLongUrl);

module.exports = router;
