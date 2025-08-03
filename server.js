const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const roomRoutes = require('./routes/rooms');
const meetingRoutes = require('./routes/meetings');
const userRoutes = require('./routes/users');

const { swaggerUi, swaggerSpec } = require('./config/swagger');
const { sequelize, User, Room, Meeting } = require('./models/index');


require('dotenv').config();

const app = express();

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes)
app.use('/api/meetings', meetingRoutes);
app.use('/api/users', userRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


app.get('/', (req, res) => {
  res.json({ message: "Dobrodošli u EnterMeet API!" });
});

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await sequelize.sync({ alter: true });
    console.log('Baza podataka je sinkronizirana.');

    app.listen(PORT, () => {
      console.log(`Server radi na portu ${PORT}`);
    });
  } catch (err) {
      console.error('Greška pri sinkronizaciji baze:', err);
    }
  }

  startServer();
