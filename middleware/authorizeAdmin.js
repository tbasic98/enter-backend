module.exports = function authorizeAdmin(req, res, next) {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({ message: 'Zabranjen pristup. Samo za administratore.' });
  }
};