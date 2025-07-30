const meetingService = require('../services/MeetingService');

exports.createMeeting = async (req, res) => {
  const { roomId, startTime, endTime, title } = req.body;
  const userId = req.user.id;

  if (!roomId || !startTime || !endTime || !title) {
    return res.status(400).json({ message: 'Nedostaju potrebni podaci.' });
  }

  try {
    const meeting = await meetingService.createMeeting(userId, roomId, startTime, endTime, title);
    return res.status(201).json({ message: 'Sastanak uspješno kreiran.', meeting });
  } catch (error) {
    if (error.message === 'Soba je zauzeta u zadanom vremenu.') {
      return res.status(409).json({ message: error.message });
    }
    console.error('Greška prilikom kreiranja sastanka:', error);
    return res.status(500).json({ message: 'Greška na serveru.' });
  }
};

exports.checkRoomAvailability = async (req, res) => {
  const { roomId, startTime, endTime } = req.body;

  if (!roomId || !startTime || !endTime) {
    return res.status(400).json({ message: 'Nedostaju potrebni podaci.' });
  }

  try {
    const available = await meetingService.isRoomAvailable(roomId, startTime, endTime);
    if (available) {
      res.json({ message: 'Soba je slobodna u zadanom periodu.', available: true });
    } else {
      res.json({ message: 'Soba je zauzeta u zadanom periodu.', available: false });
    }
  } catch (error) {
    console.error('Greška prilikom provjere zauzetosti sobe:', error);
    res.status(500).json({ message: 'Greška na serveru.' });
  }
};

//TODO: Implement other meetingController methods such as:
// POST /meetings/create - Kreiraj sastanak
// GET /meetings - Dohvati sve sastanke
// GET /meetings/:id - Dohvati detalje nekog sastanka
// PUT /meetings/:id - Ažuriraj sastanak
// DELETE /meetings/:id - Obrišite sastanak
// GET /rooms/available - Dohvati sobe dostupne u zadanom vremenskom intervalu
// GET /users/:id/meetings - Dohvati sastanke za određenog korisnika

// Napraviti paginaciju i search za usere, filter prema roli
// Paginaciju i search za sobe