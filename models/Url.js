const { DataTypes } = require('sequelize');
const sequelize = require('../database/db');
const User = require('./User').default;

const Url = sequelize.define('Url', {
  longUrl: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  shortUrl: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  customAlias: {
    type: DataTypes.STRING,
    unique: true,
  },
  topic: {
    type: DataTypes.STRING,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    }
  },
});
// Url.belongsTo(User, { foreignKey: 'userId' })

module.exports = Url;
