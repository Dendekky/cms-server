/* eslint-disable linebreak-style */
import mongoose from 'mongoose';

require('dotenv').config();

// const config = require('../config/config');
mongoose.connect(process.env.NODE_ENV == 'development' || process.env.NODE_ENV == 'test' ? process.env.DEV_DATABASE_URL : process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
})
  .catch(err => console.log(err));
