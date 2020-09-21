/* eslint-disable linebreak-style */
import mongoose from 'mongoose';

const postSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  slug: {
    type: String,
  },
  excerpt: {
    type: String,
  },
  body: {
    type: String,
    required: true,
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
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PostComments',
  }],
},
{
  timestamps: true,
});

const BlogPost = mongoose.model('PublishedPosts', postSchema);

module.exports = BlogPost;
