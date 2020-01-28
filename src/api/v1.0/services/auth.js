/* eslint-disable linebreak-style */
import Users from '../models/user';

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config/config');

exports.authenticate = params => Users.findOne({
  email: params.email,
})
  .then((user) => {
    if (!user) { throw new Error('Authentication failed. User not found.'); }
    if (!bcrypt.compareSync(params.password || '', user.password)) { throw new Error('Authentication failed. Wrong password.'); }
    const payload = {
      email: user.email,
      id: user.id,
      time: new Date(),
    };
    const token = jwt.sign(payload, config.development.jwtSecret || config.production.jwtSecret, {
      expiresIn: config.development.tokenExpireTime || config.production.tokenExpireTime,
    });
    return token;
  });
