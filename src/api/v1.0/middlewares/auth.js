/* eslint-disable linebreak-style */
const jwt = require('jsonwebtoken');
const config = require('../config/config');

const checkAuth = (req, res, next) => {
  const token = req.headers['x-access-token'] || req.headers.authorization;
  if (!token) return res.status(403).send({ auth: false, message: 'No token provided.' });
  jwt.verify(token, config.development.jwtSecret || config.production.jwtSecret, (err, decoded) => {
    if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
    // req.user = {
    //   email: decoded.email,
    //   id: decoded.id,
    // };
    next();
  });
};

const sessionChecker = (req, res, next) => {
  console.log("cookies:", req.cookies, "cookie:", req.cookie, "session:", req.session)
  if (!req.session && !req.cookies) {
    return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
  } else {
      next();
  }    
};

module.exports = {
  checkAuth,
  sessionChecker
};
