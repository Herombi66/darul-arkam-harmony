const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Teacher = sequelize.define('Teacher', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  employeeId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  qualification: {
    type: DataTypes.STRING,
    allowNull: false
  },
  dateOfJoining: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  experience: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  salary: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  hooks: {
    beforeCreate: async (teacher) => {
      const currentYear = new Date().getFullYear().toString().substr(-2);
      const count = await Teacher.count();
      teacher.employeeId = `TCH${currentYear}${(count + 1).toString().padStart(4, '0')}`;
    }
  }
});

module.exports = Teacher;