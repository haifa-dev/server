const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
  // if (process.env.DISABLE_AUTH) return next();

  const token = req.header('Authorization');
  // 401 Unauthorized
  if (!token) return res.status(401).send('Access denied. No token provided.');

  try {
    req.user = jwt.verify(token, process.env.JWT_KEY);
    next();
  } catch (ex) {
    res.status(400).send('Invalid token.');
  }
};
