/* eslint-disable linebreak-style */
import mongoose from 'mongoose';

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minLength: 8,
  },
});

const User = mongoose.model('Users', userSchema);

module.exports = User;
