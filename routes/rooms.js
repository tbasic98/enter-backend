const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeAdmin, authorizeSelfOrAdmin } = require('../middleware');
const roomsController = require('../controllers/roomsController');

router.get('/', authenticateToken, roomsController.getAllRooms);
router.get('/:id', authenticateToken, roomsController.getAllRooms);
router.post('/', authenticateToken, authorizeAdmin, roomsController.createRoom);
router.put('/:id', authenticateToken, authorizeAdmin, roomsController.updateRoom);
router.delete('/:id', authenticateToken, authorizeAdmin, roomsController.deleteRoom)

module.exports = router;
