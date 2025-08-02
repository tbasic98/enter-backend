const express = require('express');
const router = express.Router();
const meetingController = require('../controllers/meetingController');
const { authenticateToken } = require('../middleware');
const { validateMeeting } = require('../middleware')


router.get('/', authenticateToken, meetingController.getAllMeetings);
router.get('/:id', authenticateToken, meetingController.getMeetingById);
router.post('/create', authenticateToken, validateMeeting, meetingController.createMeeting);
router.put('/:id', authenticateToken, validateMeeting, meetingController.updateMeeting);
router.delete('/:id', authenticateToken, meetingController.deleteMeeting);
router.get('/available', authenticateToken, meetingController.getAvailableRooms);
router.get('/users/:id/meetings', authenticateToken, meetingController.getMeetingsByUserId);


module.exports = router;