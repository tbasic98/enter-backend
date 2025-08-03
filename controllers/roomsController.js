const RoomService = require('../services/RoomService');

exports.getAllRooms = async (req, res) => {
  const { page = 1, limit = 10, search = '' } = req.query;

  try {
    const result = await RoomService.getAllRooms({ page, limit, search });
    res.json(result);
  } catch (err) {
    console.error('Error fetching rooms:', err);
    res.status(500).json({ message: 'Server error.' });
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
  const { name, capacity, location } = req.body;

  if (!name || !capacity) {
    return res.status(400).json({ message: 'Nedostaju obavezna polja.' });
  }

  try {
    const newRoom = await RoomService.createRoom({ name, capacity, location });
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