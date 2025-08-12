const AuthService = require('../services/AuthService');

exports.register = async (req, res) => {
  const { firstName, lastName, username, email, password } = req.body;

  if (!firstName || !lastName || !username || !email || !password) {
    return res.status(400).json({ message: 'Sva polja su obavezna.' });
  }

  try {
    await AuthService.registerUser({ firstName, lastName, username, email, password });
    res.status(201).json({ message: 'Korisnik uspješno registriran.' });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email i lozinka su obavezni.' });
  }

  try {
    const {token, user} = await AuthService.authenticateUser({ email, password });
    res.json({
      message: 'Uspješan login.',
      token,
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        email: user.email
      }
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
};

exports.currentUser = async (req, res) => {
  try {
    res.json({ user: req.user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Greška pri dohvaćanju korisnika.' });
  }
};

exports.logout = (req, res) => {
  res.json({ message: 'Odjavljeni ste. Uklonite token na klijentskoj strani.' });
};
