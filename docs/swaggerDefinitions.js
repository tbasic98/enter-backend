/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: Authentication endpoints
 *   - name: Users
 *     description: Manage application users
 *   - name: Rooms
 *     description: Manage meeting rooms
 *   - name: Meetings
 *     description: Manage meetings and availability
 *
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         firstName:
 *           type: string
 *         lastName:
 *           type: string
 *         email:
 *           type: string
 *         role:
 *           type: string
 *
 *     CreateUser:
 *       type: object
 *       required: [firstName, lastName, email, password]
 *       properties:
 *         firstName:
 *           type: string
 *         lastName:
 *           type: string
 *         email:
 *           type: string
 *         password:
 *           type: string
 *
 *     Room:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *         capacity:
 *           type: integer
 *         location:
 *           type: string
 *
 *     CreateRoom:
 *       type: object
 *       required: [name, capacity, location]
 *       properties:
 *         name:
 *           type: string
 *         capacity:
 *           type: integer
 *         location:
 *           type: string
 *
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
 */