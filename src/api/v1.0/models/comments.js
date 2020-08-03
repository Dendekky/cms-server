// /* eslint-disable linebreak-style */
import mongoose from 'mongoose';

const commentSchema = mongoose.Schema({
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PublishedPosts',
  },
  depth: {
    type: Number,
    default: 1,
  },
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    default: null,
  },
  name: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
},
{
  timestamps: true,
});

const PostComment = mongoose.model('PostComments', commentSchema);

module.exports = PostComment;
