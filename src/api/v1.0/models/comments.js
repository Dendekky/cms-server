// /* eslint-disable linebreak-style */
import mongoose from 'mongoose';

const commentSchema = mongoose.Schema({
      name: {
      type: String,
      required: true,
      },
      message: {
      type: String,
      required: true,
      },
      post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "PublishedPosts"
      }
    },
{
  timestamps: true,
});

const PostComment = mongoose.model('PostComments', commentSchema);

module.exports = PostComment;
