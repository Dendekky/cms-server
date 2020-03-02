/* eslint-disable linebreak-style */
import mongoose from 'mongoose';

require('dotenv').config();

// const config = require('../config/config');

mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
})
  .catch(err => console.log(err));
