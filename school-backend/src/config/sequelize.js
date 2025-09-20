const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('postgresql://postgres:Herombi66@localhost:5432/school_management', {
  dialect: 'postgres',
  logging: false,
});

module.exports = sequelize;