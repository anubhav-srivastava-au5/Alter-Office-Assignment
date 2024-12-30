const Url = require('../models/Url');
const RedirectLog = require('../models/RedirectAnalytics');
const shortid = require('shortid');
const geoip = require('geoip-lite');
const redis = require('../config/redisClient');


const generateShortUrl = () => {
  return shortid.generate();
};

exports.createShortUrl = async (req, res) => {
  const { longUrl, customAlias, topic } = req.body;
  if (!longUrl) {
    return res.status(400).json({ error: 'longUrl is required' });
  }

  try {
    let shortUrl;

    if (customAlias) {
      const existingAlias = await Url.findOne({ where: { customAlias } });
      if (existingAlias) {
        return res.status(400).json({ error: 'customAlias is already taken' });
      }
      shortUrl = customAlias;
    } else {
      shortUrl = generateShortUrl();
    }

    const newUrl = await Url.create({
      longUrl,
      shortUrl,
      customAlias: customAlias || null,
      topic,
      userId:req.user.id
    });


    await redis.set(shortUrl, longUrl, 'EX', 3600);

    res.status(201).json({
      shortUrl: `${req.protocol}://${req.get('host')}/${shortUrl}`,
      createdAt: newUrl.createdAt,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.redirectToLongUrl = async (req, res) => {
  try {
    const { shortUrl } = req.params;
    const cachedUrl = await redis.get(shortUrl);
    if (cachedUrl) {
      res.redirect(cachedUrl);
      return;
    }
    const url = await Url.findOne({ where: { shortUrl } });

    if (!url) {
      return res.status(404).json({ error: 'Short URL not found' });
    }

    const userAgent = req.headers['user-agent'];
    const ipAddress = req.ip;
    const geolocation = geoip.lookup(ipAddress);
    let data=await RedirectLog.create({
      shortUrl,
      userAgent,
      ipAddress,
      geolocation,
    });
    console.log({data});
    res.redirect(url.longUrl);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};
