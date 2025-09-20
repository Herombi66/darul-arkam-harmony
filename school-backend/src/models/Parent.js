const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Parent = sequelize.define('Parent', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  occupation: {
    type: DataTypes.STRING,
    allowNull: true
  },
  relationship: {
    type: DataTypes.ENUM('father', 'mother', 'guardian'),
    allowNull: false
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
});

module.exports = Parent;