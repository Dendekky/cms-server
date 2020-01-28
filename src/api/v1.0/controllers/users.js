/* eslint-disable linebreak-style */
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import {
  check, body, sanitizeBody, validationResult,
} from 'express-validator';
// import config from '../config/config';
import authService from '../services/auth';
import userService from '../services/user';

const config = require('../config/config');

const login = [
  body('email').isEmail().withMessage('Type in an actual email').normalizeEmail(),
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
        res.status(200).header('x-auth-token', token).json({
          success: true,
          token,
          status: 200,
        });
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
const register = [
  check('name').isLength({ min: 3 }).withMessage('Please input your full name'),
  body('email').isEmail().withMessage('Type in an actual email').normalizeEmail(),
  check('password').isLength({ min: 6 }).withMessage('must be at least 6 characters long'),
  async (req, res, next) => {
    const errors = await validationResult(req);
    if (!errors.isEmpty()) {
      res.status(401).send({
        errors: errors.array(),
        status: 401,
      });
    } else {
      const exists = await userService.getUserByLogin(req.body.email || '');
      if (exists) {
        return res.status(401).send({
          success: false,
          message: 'Registration failed. User with this email already registered.',
          status: 401,
        });
      }
      const user = {
        name: req.body.name,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, config.development.saltingRounds),
      };
      return userService.addUser(user)
        .then(() => res.status(201).send({
          success: true,
          password: user.password,
          name: user.name,
          status: 201,
        }));
    }
  },
];

const userList = (req, res) => userService.getAll()
  .then(data => res.send(data));
module.exports = {
  register,
  login,
  userList,
};
