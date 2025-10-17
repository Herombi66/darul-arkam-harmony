const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const TicketResponse = sequelize.define('TicketResponse', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  ticketId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'SupportTickets',
      key: 'id'
    }
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  authorId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  isInternal: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  timestamps: true,
  indexes: [
    {
      fields: ['ticketId']
    },
    {
      fields: ['authorId']
    },
    {
      fields: ['createdAt']
    }
  ]
});

// Define associations
TicketResponse.associate = (models) => {
  TicketResponse.belongsTo(models.SupportTicket, {
    foreignKey: 'ticketId',
    as: 'ticket'
  });

  TicketResponse.belongsTo(models.User, {
    foreignKey: 'authorId',
    as: 'author'
  });
};

module.exports = TicketResponse;