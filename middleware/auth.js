const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const AppError = require('../utils/AppError');

module.exports = async (req, res, next) => {
  // if (process.env.DISABLE_AUTH) return next();
  // 401 Unauthorized
  try {
    const authHeader = req.headers.authorization;
    let token;
    // check header for verification token
    if (authHeader && authHeader.startsWith('Bearer')) token = authHeader.split(' ')[1];

    if (!token) throw new AppError('Invalid Credentials', 401);
    // validate authentication token
    const decode = await promisify(jwt.verify)(token, process.env.JWT_KEY);

    // check if user still exists
    const user = await User.findByPk(decode.sub);

    if (!user) throw new AppError('Invalid Credentials', 401);

    // check if token was generated for the user last version
    if (user.authUserChanged(decode.iat)) throw new AppError('Invalid Credentials', 401);

    // grant access to protected route
    req.user = user;
  } catch (ex) {
    next(ex);
  }
  next();
};

// (module.exports = function(req, res, next) {
//     // if (process.env.DISABLE_AUTH) return next();

//     const token = req.header('Authorization');
//     // 401 Unauthorized
//     if (!token) return res.status(401).send('Access denied. No token provided.');

//     try {
//       req.user = jwt.verify(token, process.env.JWT_KEY);
//       next();
//     } catch (ex) {
//       res.status(400).send('Invalid token.');
//     }
//   });
