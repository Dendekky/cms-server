/* eslint-disable linebreak-style */
import Users from '../models/user';

// const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
require('dotenv').config();


exports.authenticate = params => {
    const payload = {
      username: params.username,
      id: params.password,
      time: new Date(),
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: config.development.tokenExpireTime || config.production.tokenExpireTime,
    });
    return token;
  // });
}