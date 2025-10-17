const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const OAuthClient = sequelize.define('OAuthClient', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  clientId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  clientSecret: {
    type: DataTypes.STRING,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  redirectUris: {
    type: DataTypes.TEXT,
    allowNull: true,
    get() {
      const value = this.getDataValue('redirectUris');
      return value ? JSON.parse(value) : [];
    },
    set(value) {
      this.setDataValue('redirectUris', JSON.stringify(value));
    }
  },
  grants: {
    type: DataTypes.TEXT,
    allowNull: true,
    get() {
      const value = this.getDataValue('grants');
      return value ? JSON.parse(value) : ['authorization_code', 'refresh_token'];
    },
    set(value) {
      this.setDataValue('grants', JSON.stringify(value));
    }
  },
  scope: {
    type: DataTypes.STRING,
    defaultValue: 'read write'
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
});

module.exports = OAuthClient;