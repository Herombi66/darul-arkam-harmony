const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const AssignmentSubmission = sequelize.define('AssignmentSubmission', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  submissionDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  attachments: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  remarks: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  marks: {
    type: DataTypes.DECIMAL(5, 2),
    defaultValue: 0
  },
  status: {
    type: DataTypes.ENUM('submitted', 'graded', 'late', 'rejected'),
    defaultValue: 'submitted'
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
});

module.exports = AssignmentSubmission;