const authenticateToken = require('./authMiddleware');
const authorizeAdmin = require('./authorizeAdmin');
const authorizeSelfOrAdmin = require('./authorizeSelfOrAdmin');

module.exports = {
  authenticateToken,
  authorizeAdmin,
  authorizeSelfOrAdmin,
};
