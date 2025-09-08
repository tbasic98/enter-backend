const express = require('express');
const router = express.Router();
const meetingController = require('../controllers/meetingController');
const { authenticateToken } = require('../middleware');
const { validateMeeting } = require('../middleware')

/**
 * @swagger
 * tags:
 *   name: Meetings
 *   description: API for managing meetings
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Meeting:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         title:
 *           type: string
 *         startTime:
 *           type: string
 *           format: date-time
 *         endTime:
 *           type: string
 *           format: date-time
 *         userId:
 *           type: string
 *         roomId:
 *           type: string
 *     CreateMeeting:
 *       type: object
 *       required:
 *         - userId
 *         - roomId
 *         - startTime
 *         - endTime
 *         - title
 *       properties:
 *         userId:
 *           type: string
 *         roomId:
 *           type: string
 *         startTime:
 *           type: string
 *           format: date-time
 *         endTime:
 *           type: string
 *           format: date-time
 *         title:
 *           type: string
 *     UpdateMeeting:
 *       type: object
 *       properties:
 *         roomId:
 *           type: string
 *         startTime:
 *           type: string
 *           format: date-time
 *         endTime:
 *           type: string
 *           format: date-time
 *         title:
 *           type: string
 */

/**
 * @swagger
 * /meetings:
 *   get:
 *     summary: Get all meetings
 *     description: Returns all meetings or filters by start and end date.
 *     tags: [Meetings]
 *     parameters:
 *       - in: query
 *         name: startTime
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Filter meetings starting from this date
 *       - in: query
 *         name: endTime
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Filter meetings ending before this date
 *     responses:
 *       200:
 *         description: List of meetings
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Meeting'
 */

/**
 * @swagger
 * /meetings/{id}:
 *   get:
 *     summary: Get meeting by ID
 *     tags: [Meetings]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Meeting ID
 *     responses:
 *       200:
 *         description: Meeting details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Meeting'
 *       404:
 *         description: Meeting not found
 */

/**
 * @swagger
 * /meetings/create:
 *   post:
 *     summary: Create a new meeting
 *     tags: [Meetings]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateMeeting'
 *     responses:
 *       201:
 *         description: Meeting created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Meeting'
 *       400:
 *         description: Invalid data or room is already booked
 */

/**
 * @swagger
 * /meetings/{id}:
 *   put:
 *     summary: Update an existing meeting
 *     tags: [Meetings]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Meeting ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateMeeting'
 *     responses:
 *       200:
 *         description: Meeting updated successfully
 *       404:
 *         description: Meeting not found
 *       400:
 *         description: Room is already booked or invalid data
 */

/**
 * @swagger
 * /meetings/{id}:
 *   delete:
 *     summary: Delete a meeting
 *     tags: [Meetings]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Meeting ID
 *     responses:
 *       200:
 *         description: Meeting deleted successfully
 *       404:
 *         description: Meeting not found
 */

/**
 * @swagger
 * /meetings/available:
 *   get:
 *     summary: Get available rooms
 *     description: Returns rooms that are not booked in the given time range.
 *     tags: [Meetings]
 *     parameters:
 *       - in: query
 *         name: startTime
 *         required: true
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: endTime
 *         required: true
 *         schema:
 *           type: string
 *           format: date-time
 *     responses:
 *       200:
 *         description: List of available rooms
 */

/**
 * @swagger
 * /meetings/users/{id}:
 *   get:
 *     summary: Get all meetings for a specific user
 *     tags: [Meetings]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: List of user meetings
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Meeting'
 */

router.get('/', authenticateToken, meetingController.getAllMeetings);
router.get('/available', authenticateToken, meetingController.getAvailableRooms);
router.get('/users/:id', authenticateToken, meetingController.getMeetingsByUserId);
router.get('/rooms/:id', authenticateToken, meetingController.getMeetingsByRoomId);
router.get('/:id', authenticateToken, meetingController.getMeetingById);
router.post('/create', authenticateToken, validateMeeting, meetingController.createMeeting);
router.put('/:id', authenticateToken, validateMeeting, meetingController.updateMeeting);
router.delete('/:id', authenticateToken, meetingController.deleteMeeting);

router.post('/sensor', meetingController.handleRoomSensor);

module.exports = router;