const User = require('../models/User');

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Greška na serveru.' });
  }
};

exports.getUserById = async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findByPk(roomId);
    if (!user) {
      return res.status(404).json({ message: 'Korisnik nije pronađena.' });
    }
    res.json(user);
  } catch (err) {
    console.error('Greška prilikom dohvaćanja korisnika:', err);
    res.status(500).json({ message: 'Greška na serveru.' });
  }
};

exports.updateUser = async (req, res) => {
  const userId = req.params.id;
  const { firstName, lastName } = req.body;

  try {
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: 'Korisnik nije pronađen.' });
    }

    user.firstName = firstName ?? user.firstName;
    user.lastName = firstName ?? user.lastName;

    await user.save();

    res.json({ message: 'Korisnik je ažuriran.', user });
  } catch (err) {
    console.error('Greška prilikom ažuriranja korisnikovih podataka:', err);
    res.status(500).json({ message: 'Greška na serveru.' });
  }
};

exports.deleteUser = async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: 'Korisnik nije pronađena.' });
    }
    await user.destroy();

    res.json({ message: 'Korisnik je uspješno obrisan.' });
  } catch (err) {
    console.error('Greška prilikom brisanja korisnika:', err);
    res.status(500).json({ message: 'Greška na serveru.' });
  }
};

exports.updateUserRole = async (req, res) => {
  const userId = req.params.id;
  const { role } = req.body;
  const validRoles = ['user', 'admin'];

  if (!validRoles.includes(role)) {
    return res.status(400).json({ message: 'Nevažeća uloga. Dozvoljene vrijednosti su "user" ili "admin".' });
  }

  try {
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: 'Korisnik nije pronađen.' });
    }

    user.role = role;

    await user.save();

    res.json({ message: 'Korisnik je ažuriran.', user });
  } catch (err) {
    console.error('Greška prilikom ažuriranja korisnikovih podataka:', err);
    res.status(500).json({ message: 'Greška na serveru.' });
  }
};