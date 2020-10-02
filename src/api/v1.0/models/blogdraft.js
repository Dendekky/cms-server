/* eslint-disable linebreak-style */
import mongoose from 'mongoose';

const draftSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  excerpt: {
    type: String,
  },
  body: {
    type: String,
  },
  category: {
    type: String,
    required: true,
    trim: true,
  },
  tags: {
    type: Array,
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
