const RoomService = require('../services/RoomService');

exports.getAllRooms = async (req, res) => {
  try {
    const rooms = await RoomService.getAllRooms();
    res.json(rooms);
  } catch (err) {
    console.error('Greška pri dohvaćanju soba:', err);
    res.status(500).json({ message: 'Greška na serveru.' });
  }
};

exports.getRoomById = async (req, res) => {
  try {
    const room = await RoomService.getRoomById(req.params.id);
    if (!room) return res.status(404).json({ message: 'Soba nije pronađena.' });

    res.json(room);
  } catch (err) {
    console.error('Greška pri dohvaćanju sobe:', err);
    res.status(500).json({ message: 'Greška na serveru.' });
  }
};

exports.createRoom = async (req, res) => {
  const { name, capacity } = req.body;

  if (!name || !capacity) {
    return res.status(400).json({ message: 'Nedostaju obavezna polja.' });
  }

  try {
    const newRoom = await RoomService.createRoom({ name, capacity });
    res.status(201).json(newRoom);
  } catch (err) {
    console.error('Greška pri kreiranju sobe:', err);
    res.status(500).json({ message: 'Greška na serveru.' });
  }
};

exports.updateRoom = async (req, res) => {
  try {
    const updatedRoom = await RoomService.updateRoom(req.params.id, req.body);
    if (!updatedRoom) return res.status(404).json({ message: 'Soba nije pronađena.' });

    res.json({ message: 'Soba je ažurirana.', room: updatedRoom });
  } catch (err) {
    console.error('Greška pri ažuriranju sobe:', err);
    res.status(500).json({ message: 'Greška na serveru.' });
  }
};

exports.deleteRoom = async (req, res) => {
  try {
    const deletedRoom = await RoomService.deleteRoom(req.params.id);
    if (!deletedRoom) return res.status(404).json({ message: 'Soba nije pronađena.' });

    res.json({ message: 'Soba je uspješno obrisana.' });
  } catch (err) {
    console.error('Greška pri brisanju sobe:', err);
    res.status(500).json({ message: 'Greška na serveru.' });
  }
};