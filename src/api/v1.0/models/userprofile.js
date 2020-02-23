/* eslint-disable linebreak-style */
import mongoose from 'mongoose';

const userSchema = mongoose.Schema({
  firstname: {
    type: String,
    trim: true,
  },
  lastname: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    trim: true,
  },
  profile: {
    type: String,
    trim: true,
  },
  about: {
    type: String,
    trim: true,
  },
});

const UserProfile = mongoose.model('UserProfile', userSchema);

module.exports = UserProfile;
