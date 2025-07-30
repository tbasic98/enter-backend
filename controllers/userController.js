const UserService = require('../services/UserService');

exports.getAllUsers = async (req, res) => {
  const users = await UserService.getAllUsers();
  res.json(users);
};

exports.getUserById = async (req, res) => {
  const user = await UserService.getUserById(req.params.id);
  if (!user) return res.status(404).json({ message: 'Korisnik nije pronađen.' });
  res.json(user);
};

exports.createUser = async (req, res) => {
  const user = await UserService.createUser(req.body);
  res.status(201).json(user);
};

exports.updateUser = async (req, res) => {
  const updatedUser = await UserService.updateUser(req.params.id, req.body);
  if (!updatedUser) return res.status(404).json({ message: 'Korisnik nije pronađen.' });
  res.json(updatedUser);
};

exports.deleteUser = async (req, res) => {
  const deletedUser = await UserService.deleteUser(req.params.id);
  if (!deletedUser) return res.status(404).json({ message: 'Korisnik nije pronađen.' });
  res.json({ message: 'Korisnik obrisan.' });
};

exports.updateUserRole = async (req, res) => {
  const { role } = req.body;
  if (!['admin', 'user'].includes(role)) {
    return res.status(400).json({ message: 'Uloga mora biti "admin" ili "user".' });
  }

  const updatedUser = await UserService.updateRole(req.params.id, role);
  if (!updatedUser) return res.status(404).json({ message: 'Korisnik nije pronađen.' });

  res.json({ message: 'Uloga ažurirana.', user: updatedUser });
};
