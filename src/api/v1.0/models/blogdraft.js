/* eslint-disable linebreak-style */
import mongoose from 'mongoose';

const draftSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  body: {
    type: String,
  },
  category: {
    type: String,
    required: true,
    trim: true,
  },
  postImage: {
    type: String,
  },
},
{
  timestamps: true,
});

const BlogDraft = mongoose.model('Drafts', draftSchema);

module.exports = BlogDraft;
