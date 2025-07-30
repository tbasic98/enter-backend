const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');
const roomsController = require('../controllers/roomsController');

router.get('/', authenticateToken, roomsController.getAllRooms);
router.get('/:id', authenticateToken, roomsController.getAllRooms);
router.post('/', authenticateToken, roomsController.createRoom);
router.put('/:id', authenticateToken, roomsController.updateRoom);
router.delete('/:id', authenticateToken, roomsController.deleteRoom)

module.exports = router;
