const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'tajni_kljuc';

exports.register = async (req, res) => {
  const { firstName, lastName, username, email, password } = req.body;

  if (!firstName || !lastName || !username || !email || !password) {
    return res.status(400).json({ message: 'Sva polja su obavezna.' });
  }

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email je već zauzet.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      firstName,
      lastName,
      username,
      email,
      password: hashedPassword,
    });

    return res.status(201).json({ message: 'Korisnik uspješno registriran.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Greška na serveru.' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email i lozinka su obavezni.' });
  }

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: 'Neispravan email ili lozinka.' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ message: 'Neispravan email ili lozinka.' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '8h' }
    );

    return res.json({ message: 'Uspješan login.', token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Greška na serveru.' });
  }
};
