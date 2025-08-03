// models/index.js
const Sequelize = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
  host: process.env.DB_HOST || 'localhost',
  dialect: 'postgres',
  logging: false,
});

const User = require('./User')(sequelize);
const Room = require('./Room')(sequelize);
const Meeting = require('./Meeting')(sequelize);

Meeting.belongsTo(User, { foreignKey: 'userId', as: 'user' });
User.hasMany(Meeting, { foreignKey: 'userId', as: 'meetings' });

Meeting.belongsTo(Room, { foreignKey: 'roomId', as: 'room' });
Room.hasMany(Meeting, { foreignKey: 'roomId', as: 'meetings' });

module.exports = {
  sequelize,
  User,
  Room,
  Meeting,
};
