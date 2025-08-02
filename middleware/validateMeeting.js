const { User, Room, Meeting } = require('../models');
const { Op } = require('sequelize');

module.exports = async (req, res, next) => {
  const { userId, roomId, startTime, endTime } = req.body;

  if (!userId || !roomId || !startTime || !endTime) {
    return res.status(400).json({ message: 'Sva polja (userId, roomId, startTime, endTime) su obavezna.' });
  }

  if (new Date(startTime) >= new Date(endTime)) {
    return res.status(400).json({ message: 'Vrijeme početka mora biti prije vremena završetka.' });
  }

  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'Korisnik nije pronađen.' });
    }

    const room = await Room.findByPk(roomId);
    if (!room) {
      return res.status(404).json({ message: 'Soba nije pronađena.' });
    }

    const overlappingMeeting = await Meeting.findOne({
      where: {
        roomId,
        [Op.or]: [
          { startTime: { [Op.lt]: endTime }, endTime: { [Op.gt]: startTime } }
        ]
      }
    });

    if (overlappingMeeting) {
      return res.status(400).json({ message: 'Soba je već zauzeta u ovom terminu.' });
    }

    next();
  } catch (err) {
    console.error('Greška u validaciji sastanka:', err);
    return res.status(500).json({ message: 'Greška na serveru.' });
  }
};
