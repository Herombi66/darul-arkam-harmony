const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Event = sequelize.define('Event', {
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
  date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  startTime: {
    type: DataTypes.TIME,
    allowNull: false
  },
  endTime: {
    type: DataTypes.TIME,
    allowNull: false
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM('academic', 'sports', 'cultural', 'administrative', 'holiday'),
    allowNull: false
  },
  organizerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  maxAttendees: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  priority: {
    type: DataTypes.ENUM('low', 'medium', 'high'),
    defaultValue: 'medium'
  },
  status: {
    type: DataTypes.ENUM('upcoming', 'ongoing', 'completed', 'cancelled'),
    defaultValue: 'upcoming'
  }
}, {
  timestamps: true,
  indexes: [
    {
      fields: ['date']
    },
    {
      fields: ['type']
    },
    {
      fields: ['status']
    },
    {
      fields: ['organizerId']
    }
  ]
});

// Define associations
Event.associate = (models) => {
  Event.belongsTo(models.User, {
    foreignKey: 'organizerId',
    as: 'organizer'
  });

  // Many-to-many relationship with users for attendees
  Event.belongsToMany(models.User, {
    through: 'EventAttendees',
    foreignKey: 'eventId',
    otherKey: 'userId',
    as: 'attendees'
  });
};

module.exports = Event;