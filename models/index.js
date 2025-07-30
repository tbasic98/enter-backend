const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
  host: process.env.DB_HOST || 'localhost',
  dialect: 'postgres',
  logging: false,
});

sequelize.sync({ force: true })
  .then(() => {
    console.log('Sve tablice su sinkronizirane!');
  })
  .catch(err => {
    console.error('Greška prilikom sinkronizacije tablica:', err);
  });

const User = require('./User')(sequelize);
const Room = require('./Room')(sequelize);
const Meeting = require('./Meeting')(sequelize);

Meeting.belongsTo(User, { foreignKey: 'userId', as: 'user' });
User.hasMany(Meeting, { foreignKey: 'userId', as: 'meetings' });

Meeting.belongsTo(Room, { foreignKey: 'roomId', as: 'room' });
Room.hasMany(Meeting, { foreignKey: 'roomId', as: 'meetings' });

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('Veza s bazom uspješna!');
  } catch (error) {
    console.error('Ne mogu se povezati s bazom:', error);
  }
}

testConnection();

module.exports = {
  sequelize,
  User,
  Room,
  Meeting,
};
