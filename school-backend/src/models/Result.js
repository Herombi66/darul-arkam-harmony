const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Result = sequelize.define('Result', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  examType: {
    type: DataTypes.ENUM('CA1', 'CA2', 'CA3', 'Exam'),
    allowNull: false
  },
  marks: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false
  },
  totalMarks: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false
  },
  percentage: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true
  },
  term: {
    type: DataTypes.ENUM('First', 'Second', 'Third'),
    allowNull: false
  },
  academicYear: {
    type: DataTypes.STRING,
    allowNull: false
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  hooks: {
    beforeCreate: (result) => {
      if (result.totalMarks && result.totalMarks !== 0) {
        result.percentage = (result.marks / result.totalMarks) * 100;
      }
    },
    beforeUpdate: (result) => {
      if (result.totalMarks && result.totalMarks !== 0) {
        result.percentage = (result.marks / result.totalMarks) * 100;
      }
    }
  }
});

module.exports = Result;