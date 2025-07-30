const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const Room = sequelize.define('Room', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  location: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  capacity: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
}, {
  tableName: 'rooms',
  timestamps: true,
});

module.exports = Room;
