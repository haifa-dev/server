module.exports = function(req, res, next) {
  // if (!process.env.ADMIN_AUTHORIZATION) return next();
  // 403 Forbidden
  if (!req.user.isAdmin) return res.status(403).send('Access denied.');

  next();
};
