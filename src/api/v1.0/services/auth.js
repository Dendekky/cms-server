/* eslint-disable linebreak-style */
// const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
require('dotenv').config();


exports.authenticate = (params) => {
  const payload = {
    username: params.username,
    id: params.password,
    time: new Date(),
  };
  const token = jwt.sign(payload, process.env.JWT_SECRET);
  return token;
  // });
};
