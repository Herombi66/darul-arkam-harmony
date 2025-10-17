const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const SupportTicket = sequelize.define('SupportTicket', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  category: {
    type: DataTypes.ENUM('technical', 'academic', 'administrative', 'financial', 'other'),
    allowNull: false
  },
  priority: {
    type: DataTypes.ENUM('low', 'medium', 'high', 'urgent'),
    defaultValue: 'medium'
  },
  status: {
    type: DataTypes.ENUM('open', 'in_progress', 'resolved', 'closed'),
    defaultValue: 'open'
  },
  requesterId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  assignedToId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Users',
      key: 'id'
    }
  }
}, {
  timestamps: true,
  indexes: [
    {
      fields: ['status']
    },
    {
      fields: ['category']
    },
    {
      fields: ['priority']
    },
    {
      fields: ['requesterId']
    },
    {
      fields: ['assignedToId']
    },
    {
      fields: ['createdAt']
    }
  ]
});

// Define associations
SupportTicket.associate = (models) => {
  SupportTicket.belongsTo(models.User, {
    foreignKey: 'requesterId',
    as: 'requester'
  });

  SupportTicket.belongsTo(models.User, {
    foreignKey: 'assignedToId',
    as: 'assignedTo'
  });

  // One-to-many relationship with ticket responses
  SupportTicket.hasMany(models.TicketResponse, {
    foreignKey: 'ticketId',
    as: 'responses'
  });
};

module.exports = SupportTicket;