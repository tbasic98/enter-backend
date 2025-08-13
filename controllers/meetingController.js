const meetingService = require('../services/MeetingService');

exports.getAllMeetings = async (req, res) => {
  try {
    const { startTime, endTime } = req.query;

    const meetings = await meetingService.getAllMeetings({
      startTime,
      endTime
    });

    res.json(meetings);
  } catch (err) {
    console.error('Greška prilikom dohvaćanja sastanaka:', err);
    res.status(500).json({ message: 'Greška na serveru.' });
  }
};

exports.getMeetingById = async (req, res) => {
  try {
    const meeting = await meetingService.getMeetingById(req.params.id);

    if (!meeting) {
      return res.status(404).json({ message: 'Sastanak nije pronađen.' });
    }

    res.json(meeting);
  } catch (err) {
    console.error('Greška prilikom dohvaćanja sastanka:', err);
    res.status(500).json({ message: 'Greška na serveru.' });
  }
};

  exports.createMeeting = async (req, res) => {
    const { roomId, startTime, endTime } = req.body;
    let { title, description } = req.body;
    const userId = req.user.id;

    if (!roomId || !startTime || !endTime) {
      return res.status(400).json({ message: 'Nedostaju potrebni podaci.' });
    }

    const funnyTitles = [
      "Another Email That Could've Been",
      "Mandatory Fun Hour",
      "Ctrl+Alt+Del Meeting",
      "Who Scheduled This?",
      "Brainstorming or Brain-Freezing?",
      "We Could Be Sleeping",
      "Quick Sync That Isn’t Quick",
      "Meeting About Meetings",
      "The Neverending Story",
      "Free Donuts (Got Your Attention)",
      "Someone Will Cry Today",
      "Half the Team is Missing",
      "Another Calendar Blocker",
      "Bring Your Own Coffee",
      "Oops, We Did It Again",
      "90% Silence, 10% Awkward",
      "No Agenda, No Problem",
      "This Will Be Forwarded",
      "Unmute Yourself Please",
      "Hope You Like Surprises"
    ];

    let generatedTitle = false;

    if (!title || title.trim() === '') {
      title = funnyTitles[Math.floor(Math.random() * funnyTitles.length)];
      generatedTitle = true;
    }

    if (generatedTitle) {
      const disclaimer = "\n\n⚠️ Napomena: Naslov sastanka je automatski generiran za zabavu.";
      description = description ? description + disclaimer : disclaimer;
    }

    try {
      const meeting = await meetingService.createMeeting(userId, roomId, startTime, endTime, title, description);
      return res.status(201).json({ message: 'Sastanak uspješno kreiran.', meeting });
    } catch (error) {
      if (error.message === 'Soba je zauzeta u zadanom vremenu.') {
        return res.status(409).json({ message: error.message });
      }
      console.error('Greška prilikom kreiranja sastanka:', error);
      return res.status(500).json({ message: 'Greška na serveru.' });
    }
  };

exports.updateMeeting = async (req, res) => {
  try {
    const updatedMeeting = await meetingService.updateMeeting(req.params.id, req.body);

    if (!updatedMeeting) {
      return res.status(404).json({ message: 'Sastanak nije pronađen.' });
    }

    res.json({ message: 'Sastanak uspješno ažuriran.', meeting: updatedMeeting });
  } catch (err) {
    console.error('Greška prilikom ažuriranja sastanka:', err);
    res.status(400).json({ message: err.message || 'Greška na serveru.' });
  }
};

exports.deleteMeeting = async (req, res) => {
  try {
    const deleted = await meetingService.deleteMeeting(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: 'Sastanak nije pronađen.' });
    }

    res.json({ message: 'Sastanak uspješno obrisan.' });
  } catch (err) {
    console.error('Greška prilikom brisanja sastanka:', err);
    res.status(500).json({ message: 'Greška na serveru.' });
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

exports.getAvailableRooms = async (req, res) => {
  const { startTime, endTime } = req.query;

  if (!startTime || !endTime) {
    return res.status(400).json({ message: 'startTime i endTime su obavezni parametri.' });
  }

  try {
    const availableRooms = await meetingService.getAvailableRooms(startTime, endTime);
    res.json(availableRooms);
  } catch (err) {
    console.error('Greška prilikom dohvaćanja slobodnih soba:', err);
    res.status(500).json({ message: 'Greška na serveru.' });
  }
};


exports.getMeetingsByUserId = async (req, res) => {
  const userId = req.params.id;

  try {
    const meetings = await meetingService.getMeetingsByUserId(userId);

    if (!meetings || meetings.length === 0) {
      return res.status(404).json({ message: 'Nema sastanaka za ovog korisnika.' });
    }

    res.json(meetings);
  } catch (err) {
    console.error('Greška prilikom dohvaćanja sastanaka korisnika:', err);
    res.status(500).json({ message: 'Greška na serveru.' });
  }
};

exports.getMeetingsByRoomId = async (req, res) => {
  const roomId = req.params.id;

  try {
    const meetings = await meetingService.getMeetingsByRoomId(roomId);

    if (!meetings || meetings.length === 0) {
      return res.status(404).json({ message: 'Nema sastanaka za ovu sobu.' });
    }

    res.json(meetings);
  } catch (err) {
    console.error('Greška prilikom dohvaćanja sastanaka korisnika:', err);
    res.status(500).json({ message: 'Greška na serveru.' });
  }
};