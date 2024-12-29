const { DataTypes } = require('sequelize');
const sequelize = require('../database/db');

const RedirectLog = sequelize.define('RedirectLog', {
  shortUrl: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  timestamp: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  userAgent: {
    type: DataTypes.STRING,
  },
  ipAddress: {
    type: DataTypes.STRING,
  },
  geolocation: {
    type: DataTypes.JSON,
  },
});

module.exports = RedirectLog;