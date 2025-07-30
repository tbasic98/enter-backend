const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'tajni_kljuc';

class AuthService {
  static async registerUser({ firstName, lastName, username, email, password }) {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw new Error('Email je već zauzet.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      firstName,
      lastName,
      username,
      email,
      password: hashedPassword,
    });
  }

  static async authenticateUser({ email, password }) {
    const user = await User.findOne({ where: { email } });
    if (!user) throw new Error('Neispravan email ili lozinka.');

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new Error('Neispravan email ili lozinka.');

    return jwt.sign(
      {id: user.id, email: user.email, role: user.role},
      JWT_SECRET,
      {expiresIn: '8h'}
    );
  }
}

module.exports = AuthService;
