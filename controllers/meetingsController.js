const Meeting = require('../models/Meeting');

exports.getMeetingsByRoom = async (req, res) => {
  const { roomId } = req.params;
  try {
    const meetings = await Meeting.findAll({ where: { roomId } });
    res.json(meetings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Greška na serveru.' });
  }
};

exports.createMeeting = async (req, res) => {
  const { roomId } = req.params;
  const { userId, startTime, endTime, title } = req.body;

  if (!startTime || !endTime || !title) {
    return res.status(400).json({ message: 'Nedostaju obavezna polja.' });
  }

  try {
    const meeting = await Meeting.create({
      roomId,
      userId,
      startTime,
      endTime,
      title,
    });
    res.status(201).json(meeting);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Greška na serveru.' });
  }
};
