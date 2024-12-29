const express = require('express');
const { createShortUrl, redirectToLongUrl } = require('../controllers/urlController');
const router = express.Router();

router.post('/api/shorten', createShortUrl);
router.get('/api/shorten/:shortUrl', redirectToLongUrl);

module.exports = router;