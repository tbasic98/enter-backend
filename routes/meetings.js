const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');
const meetingsController = require('../controllers/meetingsController');

router.get('/:roomId', authenticateToken, meetingsController.getMeetingsByRoom);
router.post('/:roomId', authenticateToken, meetingsController.createMeeting);

module.exports = router;
