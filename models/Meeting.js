const { DataTypes } = require('sequelize');
const sequelize = require('./index');
const User = require('./User');
const Room = require('./Room');

const Meeting = sequelize.define('Meeting', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  start_time: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  end_time: {
    type: DataTypes.DATE,
    allowNull: false,
  },
}, {
  tableName: 'meetings',
  timestamps: true,
});

// Relacije
User.hasMany(Meeting, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Meeting.belongsTo(User, { foreignKey: 'user_id' });

Room.hasMany(Meeting, { foreignKey: 'room_id', onDelete: 'CASCADE' });
Meeting.belongsTo(Room, { foreignKey: 'room_id' });

module.exports = Meeting;
