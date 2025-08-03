const { Sequelize } = require('sequelize');
require('dotenv').config();

const isDebug = process.env.DEBUG === 'true';

const sequelize = isDebug
  ? new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
      host: process.env.DB_HOST || 'localhost',
      dialect: 'postgres',
      logging: true,
    })
  : new Sequelize(process.env.DATABASE_URL, {
      dialect: 'postgres',
      protocol: 'postgres',
      logging: false,
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      },
    });

module.exports = sequelize;