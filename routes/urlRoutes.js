const express = require('express');
const { createShortUrl, redirectToLongUrl } = require('../controllers/urlController');
const router = express.Router();
const authenticate=require("../middleware/authenticate");

router.post('/api/shorten',authenticate, createShortUrl);
router.get('/api/shorten/:shortUrl', redirectToLongUrl);

module.exports = router;