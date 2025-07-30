const Room = require('../models/Room');

exports.getAllRooms = async (req, res) => {
  try {
    const rooms = await Room.findAll();
    res.json(rooms);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Greška na serveru.' });
  }
};

exports.createRoom = async (req, res) => {
  const { name, capacity } = req.body;
  if (!name || !capacity) {
    return res.status(400).json({ message: 'Nedostaju obavezna polja.' });
  }
  try {
    const newRoom = await Room.create({ name, capacity });
    res.status(201).json(newRoom);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Greška na serveru.' });
  }
};

exports.getRoomById = async (req, res) => {
  const roomId = req.params.id;

  try {
    const room = await Room.findByPk(roomId);
    if (!room) {
      return res.status(404).json({ message: 'Soba nije pronađena.' });
    }
    res.json(room);
  } catch (err) {
    console.error('Greška prilikom dohvaćanja sobe:', err);
    res.status(500).json({ message: 'Greška na serveru.' });
  }
};

exports.updateRoom = async (req, res) => {
  const roomId = req.params.id;
  const { name, capacity, location } = req.body;

  try {
    const room = await Room.findByPk(roomId);

    if (!room) {
      return res.status(404).json({ message: 'Soba nije pronađena.' });
    }

    room.name = name ?? room.name;
    room.capacity = capacity ?? room.capacity;
    room.location = location ?? room.location;

    await room.save();

    res.json({ message: 'Soba je ažurirana.', room });
  } catch (err) {
    console.error('Greška prilikom ažuriranja sobe:', err);
    res.status(500).json({ message: 'Greška na serveru.' });
  }
};

exports.deleteRoom = async (req, res) => {
  const roomId = req.params.id;
  try {
    const room = await Room.findByPk(roomId);

    if (!room) {
      return res.status(404).json({ message: 'Soba nije pronađena.' });
    }
    await room.destroy();

    res.json({ message: 'Soba je uspješno obrisana.' });
  } catch (err) {
    console.error('Greška prilikom brisanja sobe:', err);
    res.status(500).json({ message: 'Greška na serveru.' });
  }
}