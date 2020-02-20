/* eslint-disable linebreak-style */
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import {
  check, body, sanitizeBody, validationResult,
} from 'express-validator';
import authService from '../services/auth';

require('dotenv').config();

const login = [
  body('username').isLength({ min: 6 }).withMessage('must be at least 6 characters long'),
  check('password').isLength({ min: 6 }).withMessage('must be at least 6 characters long'),
  async (req, res, next) => {
    const errors = await validationResult(req);
    if (!errors.isEmpty()) {
      res.status(401).send({
        errors: errors.array(),
        status: 401,
      });
    } else {
      try {
        const token = await authService.authenticate(req.body);
        if (req.body.username == process.env.ADMIN_USERNAME && req.body.password == process.env.ADMIN_PASSWORD ) {
        res.status(200).header('x-access-token', token).json({
          success: true,
          token,
          status: 200,
        });
        } else {
        res.status(401).send({
          success: false,
          message: err.message,
          status: 401,
        });
        }
      } catch (err) {
        res.status(401).send({
          success: false,
          message: err.message,
          status: 401,
        });
      }
    }
  },
];

  
module.exports = {
  login
};
