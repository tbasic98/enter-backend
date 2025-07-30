const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
  host: process.env.DB_HOST || 'localhost',
  dialect: 'postgres',
  logging: false,
});

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('Veza s bazom uspješna!');
  } catch (error) {
    console.error('Ne mogu se povezati s bazom:', error);
  }
}

testConnection();

module.exports = sequelize;
