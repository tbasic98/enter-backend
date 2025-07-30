const express = require('express');
const router = express.Router();
const meetingController = require('../controllers/meetingController');
const { authenticateToken } = require('../middleware');

router.post('/create', authenticateToken, meetingController.createMeeting);

module.exports = router;