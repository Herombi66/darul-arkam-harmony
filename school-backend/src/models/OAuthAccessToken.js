const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');
const User = require('./User');
const OAuthClient = require('./OAuthClient');

const OAuthAccessToken = sequelize.define('OAuthAccessToken', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  accessToken: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  accessTokenExpiresAt: {
    type: DataTypes.DATE,
    allowNull: false
  },
  scope: {
    type: DataTypes.STRING,
    allowNull: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  clientId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: OAuthClient,
      key: 'id'
    }
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
});

// Define associations
OAuthAccessToken.belongsTo(User, { foreignKey: 'userId', as: 'user' });
OAuthAccessToken.belongsTo(OAuthClient, { foreignKey: 'clientId', as: 'client' });

module.exports = OAuthAccessToken;