const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Payment = sequelize.define('Payment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  paymentType: {
    type: DataTypes.ENUM('tuition', 'uniform', 'books', 'transportation', 'examination', 'other'),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  paymentDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  academicYear: {
    type: DataTypes.STRING,
    allowNull: false
  },
  term: {
    type: DataTypes.ENUM('First', 'Second', 'Third'),
    allowNull: false
  },
  paymentMethod: {
    type: DataTypes.ENUM('paystack', 'cash', 'bank_transfer', 'other'),
    allowNull: false
  },
  transactionReference: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true
  },
  paymentStatus: {
    type: DataTypes.ENUM('pending', 'completed', 'failed', 'refunded'),
    defaultValue: 'pending'
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
});

module.exports = Payment;