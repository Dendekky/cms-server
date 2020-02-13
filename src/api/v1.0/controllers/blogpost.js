import { check, body, validationResult } from 'express-validator';
import BlogPost from '../models/blogpost';


exports.createPost = [
  check('title').isLength({ min: 3 }).withMessage('Please input a title'),
  body('category').isLength({ min: 3 }).withMessage('input category'),
  check('body').isLength({ min: 3 }).withMessage('Please input the blog'),
  check('metadata').isLength({ min: 3 }).withMessage('Please input the summary'),

  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(406).send({
        errors: errors.array(),
        status: 406,
      });
    } else {
      const { title } = req.body;
      const { category } = req.body;
      const { body } = req.body;
      const { metadata } = req.body;
      const { postImage } = req.body;

      const post = new BlogPost({
        title,
        category,
        body,
        metadata,
        postImage,
      });
      post.save((err) => {
        if (err) {
          return res.status(500).send({
            status: 500,
            message: 'Internal server error',
          });
        }
        res.status(201).send({
          status: 201,
          success: 'saved to post',
        });
      });
    }
  },
];

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


exports.getPost = (req, res) => BlogPost.findById(req.params.id, (err, post) => {
  if (err) {
    res.status(500).send({
      message: 'Internal server error',
    });
  }
  res.status(200).send({
    post,
  });
});


exports.updatePost = [
  check('title').isLength({ min: 3 }).withMessage('Please input a title'),
  body('category').isLength({ min: 3 }).withMessage('input category'),
  check('body').isLength({ min: 3 }).withMessage('Please input the blog'),
  check('metadata').isLength({ min: 3 }).withMessage('Please input the summary'),

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


// module.exports = {
//     createPost,
//     getAllPosts,
//     getPost,
//     updatePost,
//     deletePost
// }
