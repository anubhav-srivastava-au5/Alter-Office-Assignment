const Url = require('../models/Url');
const RedirectLog = require('../models/RedirectAnalytics');
const redis = require('../config/redisClient');
const moment = require('moment');
const { Op } = require('sequelize');



exports.getUrlAnalytics = async (req, res) => {
    try {
      const { alias } = req.params;
  
      const cachedAnalytics = await redis.get(`analytics:${alias}`);
      if (cachedAnalytics) {
        return res.status(200).json(JSON.parse(cachedAnalytics));
      }
      const url = await Url.findOne({ where: { shortUrl: alias } });
  
      if (!url) {
        return res.status(404).json({ error: 'Short URL not found' });
      }
  
      const sevenDaysAgo = moment().subtract(7, 'days').toDate();
  
      const logs = await RedirectLog.findAll({
        where: {
          shortUrl: alias,
          timestamp: {
            [Op.gte]: sevenDaysAgo,
          },
        },
      });
  
      const totalClicks = logs.length;
      const uniqueUsers = new Set(logs.map(log => log.ipAddress)).size;
  
      const clicksByDate = logs.reduce((acc, log) => {
        const date = moment(log.timestamp).format('YYYY-MM-DD');
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      }, {});
  
      const osType = logs.reduce((acc, log) => {
        const os = log.userAgent; // Simplified, parse for actual OS if needed
        if (!acc[os]) {
          acc[os] = { uniqueClicks: 0, uniqueUsers: new Set() };
        }
        acc[os].uniqueClicks++;
        acc[os].uniqueUsers.add(log.ipAddress);
        return acc;
      }, {});
  
      const osTypeFormatted = Object.entries(osType).map(([osName, data]) => ({
        osName,
        uniqueClicks: data.uniqueClicks,
        uniqueUsers: data.uniqueUsers.size,
      }));
  
      const deviceType = logs.reduce((acc, log) => {
        const device = /mobile/i.test(log.userAgent) ? 'mobile' : 'desktop';
        if (!acc[device]) {
          acc[device] = { uniqueClicks: 0, uniqueUsers: new Set() };
        }
        acc[device].uniqueClicks++;
        acc[device].uniqueUsers.add(log.ipAddress);
        return acc;
      }, {});
  
      const deviceTypeFormatted = Object.entries(deviceType).map(([deviceName, data]) => ({
        deviceName,
        uniqueClicks: data.uniqueClicks,
        uniqueUsers: data.uniqueUsers.size,
      }));
  
  
      const analyticsData = {
        totalClicks,
        uniqueUsers,
        clicksByDate: Object.entries(clicksByDate).map(([date, count]) => ({ date, count })),
        osType: osTypeFormatted,
        deviceType: deviceTypeFormatted,
      }
  
      await redis.set(`analytics:${alias}`, JSON.stringify(analyticsData), 'EX', 3600);
  
      res.status(200).json(analyticsData);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  };
  
  
  
  exports.getTopicAnalytics = async (req, res) => {
    try {
      const { topic } = req.params;
  
      const urls = await Url.findAll({ where: { topic } });
  
      if (urls.length === 0) {
        return res.status(404).json({ error: 'No URLs found for the specified topic' });
      }
  
      const totalClicks = await RedirectLog.count({
        where: {
          shortUrl: {
            [Op.in]: urls.map(url => url.shortUrl),
          },
        },
      });
  
      const uniqueUsers = new Set(
        (await RedirectLog.findAll({
          where: {
            shortUrl: {
              [Op.in]: urls.map(url => url.shortUrl),
            },
          },
          attributes: ['ipAddress'],
        })).map(log => log.ipAddress)
      ).size;
  
      const clicksByDate = (await RedirectLog.findAll({
        where: {
          shortUrl: {
            [Op.in]: urls.map(url => url.shortUrl),
          },
        },
      })).reduce((acc, log) => {
        const date = moment(log.timestamp).format('YYYY-MM-DD');
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      }, {});
  
      const clicksByDateFormatted = Object.entries(clicksByDate).map(([date, count]) => ({ date, count }));
  
      const urlsAnalytics = await Promise.all(
        urls.map(async (url) => {
          const urlLogs = await RedirectLog.findAll({
            where: { shortUrl: url.shortUrl },
          });
  
          const urlTotalClicks = urlLogs.length;
          const urlUniqueUsers = new Set(urlLogs.map(log => log.ipAddress)).size;
  
          return {
            shortUrl: url.shortUrl,
            totalClicks: urlTotalClicks,
            uniqueUsers: urlUniqueUsers,
          };
        })
      );
  
      res.status(200).json({
        totalClicks,
        uniqueUsers,
        clicksByDate: clicksByDateFormatted,
        urls: urlsAnalytics,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  };
  
  
  exports.getOverallAnalytics = async (req, res) => {
    try {
      const userUrls = await Url.findAll(); 
      if (userUrls.length === 0) {
        return res.status(404).json({ error: 'No URLs found for this user' });
      }
  
      const totalUrls = userUrls.length;
  
      const totalClicks = await RedirectLog.count({
        where: {
          shortUrl: {
            [Op.in]: userUrls.map(url => url.shortUrl),
          },
        },
      });
  
      const uniqueUsers = new Set(
        (await RedirectLog.findAll({
          where: {
            shortUrl: {
              [Op.in]: userUrls.map(url => url.shortUrl),
            },
          },
          attributes: ['ipAddress'],
        })).map(log => log.ipAddress)
      ).size;
  
      const clicksByDate = (await RedirectLog.findAll({
        where: {
          shortUrl: {
            [Op.in]: userUrls.map(url => url.shortUrl),
          },
        },
      })).reduce((acc, log) => {
        const date = moment(log.timestamp).format('YYYY-MM-DD');
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      }, {});
  
      const clicksByDateFormatted = Object.entries(clicksByDate).map(([date, count]) => ({ date, count }));
  
      const osType = {};
      const deviceType = {};
  
      const logs = await RedirectLog.findAll({
        where: {
          shortUrl: {
            [Op.in]: userUrls.map(url => url.shortUrl),
          },
        },
      });
  
      logs.forEach((log) => {
        const os = log.userAgent; // Simplified, parse actual OS if needed
        const device = /mobile/i.test(log.userAgent) ? 'mobile' : 'desktop';
  
        if (!osType[os]) {
          osType[os] = { uniqueClicks: 0, uniqueUsers: new Set() };
        }
        osType[os].uniqueClicks++;
        osType[os].uniqueUsers.add(log.ipAddress);
  
        if (!deviceType[device]) {
          deviceType[device] = { uniqueClicks: 0, uniqueUsers: new Set() };
        }
        deviceType[device].uniqueClicks++;
        deviceType[device].uniqueUsers.add(log.ipAddress);
      });
  
      const osTypeFormatted = Object.entries(osType).map(([osName, data]) => ({
        osName,
        uniqueClicks: data.uniqueClicks,
        uniqueUsers: data.uniqueUsers.size,
      }));
  
      const deviceTypeFormatted = Object.entries(deviceType).map(([deviceName, data]) => ({
        deviceName,
        uniqueClicks: data.uniqueClicks,
        uniqueUsers: data.uniqueUsers.size,
      }));
  
      res.status(200).json({
        totalUrls,
        totalClicks,
        uniqueUsers,
        clicksByDate: clicksByDateFormatted,
        osType: osTypeFormatted,
        deviceType: deviceTypeFormatted,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  };
    