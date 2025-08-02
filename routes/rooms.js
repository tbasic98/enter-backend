const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeAdmin, authorizeSelfOrAdmin } = require('../middleware');
const roomsController = require('../controllers/roomsController');

/**
 * @swagger
 * /rooms:
 *   get:
 *     summary: Get all rooms
 *     tags: [Rooms]
 *     responses:
 *       200:
 *         description: List of rooms
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Room'
 *
 *   post:
 *     summary: Create a new room
 *     tags: [Rooms]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateRoom'
 *     responses:
 *       201:
 *         description: Room created
 *
 * /rooms/{id}:
 *   get:
 *     summary: Get room by ID
 *     tags: [Rooms]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Room found
 *
 *   put:
 *     summary: Update room
 *     tags: [Rooms]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateRoom'
 *     responses:
 *       200:
 *         description: Room updated
 *
 *   delete:
 *     summary: Delete room
 *     tags: [Rooms]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Room deleted
 */


router.get('/', authenticateToken, roomsController.getAllRooms);
router.get('/:id', authenticateToken, roomsController.getAllRooms);
router.post('/', authenticateToken, authorizeAdmin, roomsController.createRoom);
router.put('/:id', authenticateToken, authorizeAdmin, roomsController.updateRoom);
router.delete('/:id', authenticateToken, authorizeAdmin, roomsController.deleteRoom)

module.exports = router;