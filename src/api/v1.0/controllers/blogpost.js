import { check, body, validationResult } from 'express-validator';
import BlogPost from '../models/blogpost';
import PostComment from '../models/comments';
import parseImage from '../config/multerconfig';
import { uploadImage } from '../config/cloudinaryconfig';

exports.createPost = (req, res) => {
  parseImage(req, res, async (err) => {
    const { title, category, body } = req.body;

    if (err) {
      return res.status(500).send(err);
    }

    const file = req.files.postImage ? req.files.postImage[0].path : "";

    const postImageFile = file ? await uploadImage(file) : ""
    const postImage = postImageFile.url || ""
    const post = new BlogPost({
      title,
      category,
      body,
      postImage,
    });
    console.log(post);
    post.save((err) => {
      if (err) {
        return res.status(500).send({
          message: 'Internal server error',
        });
      }
      res.status(201).send({
        success: 'published post to blog',
      });
    });
  });
};

exports.getAllPosts = (req, res) => BlogPost.find({}, (err, posts) => {
  if (err) {
    res.status(500).send({
      status: 500,
      message: 'Internal server error',
    });
  }
  res.status(200).send({
    status: 200,
    posts,
  });
});

exports.getPost = (req, res) => BlogPost.findOne({ _id: req.params.id })
  .populate('comments')
  .then((post) => {
    if (!post) {
      return res.status(500).send({
        message: 'Internal server error',
      });
    }
    return res.status(200).json(post);
  })
  .catch((err) => {
    res.json(err);
  });

exports.updatePost = [
  check('title').isLength({ min: 3 }).withMessage('Please input a title'),
  body('category').isLength({ min: 3 }).withMessage('input category'),
  check('body').isLength({ min: 3 }).withMessage('Please input the blog'),

  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(406).send({
        errors: errors.array(),
        status: 406,
      });
    } else {
      BlogPost.findByIdAndUpdate(
        req.params.id, req.body,
        { upsert: true }, (err, post) => {
          if (err) {
            res.status(500).send({
              message: 'Internal server error',
            });
          }
          res.status(201).send({
            message: 'update successful',
          });
        },
      );
    }
  },
];

exports.deletePost = (req, res) => BlogPost.findByIdAndRemove(req.params.id, (err, del) => {
  if (err) {
    res.status(500).send({
      message: 'Internal server error',
    });
  }
  res.status(200).send({
    message: 'post deleted',
  });
});

exports.createComment = async (req, res) => {
  const { name, message, postId } = req.body;
  try {
    const commentData = {
      name,
      message,
      postId,
    };
    if ('parentId' in req.body) {
      commentData.parentId = req.body.parentId;
    }
    if ('depth' in req.body) {
      commentData.depth = req.body.depth;
    }
    const postComment = await new PostComment(commentData);
    const post = await BlogPost.findOneAndUpdate({ _id: postId }, { $push: { comments: postComment._id } }, { new: true });
    if (!post) {
      return res.status(404).send({
        message: 'Post not found',
      });
    }
    postComment.save(async (err) => {
      if (err) {
        return res.status(400).send({
          error: err.message,
        });
      }
      return res.status(201).send({
        message: 'Comment added to list',
      });
    });
  } catch (err) {
    res.status(500).send(err);
  }
};
