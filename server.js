const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const roomRoutes = require('./routes/rooms');
const meetingRoutes = require('./routes/meetings');
const userRoutes = require('./routes/users');
const cors = require('cors');

const { swaggerUi, swaggerSpec } = require('./config/swagger');
const { sequelize, User, Room, Meeting } = require('./models/index');


require('dotenv').config();

const app = express();
const allowedOrigins = process.env.ALLOWED_ORIGINS.split(',');

app.use(express.json());

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
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
