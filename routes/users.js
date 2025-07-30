const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeAdmin, authorizeSelfOrAdmin } = require('../middleware');
const userController = require('../controllers/userController');


router.get('/', authenticateToken, authorizeAdmin, userController.getAllUsers);
router.get('/:id', authenticateToken, authorizeSelfOrAdmin, userController.getUserById);
router.post('/', authenticateToken, authorizeAdmin, userController.createUser);
router.put('/:id', authenticateToken, authorizeSelfOrAdmin, userController.updateUser);
router.put('/:id/role', authenticateToken, authorizeAdmin, userController.updateUser);
router.delete('/:id', authenticateToken, authorizeAdmin, userController.deleteUser)

module.exports = router;