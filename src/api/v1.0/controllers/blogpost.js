import { check, body, validationResult } from 'express-validator';
import BlogPost from '../models/blogpost';
import  parseImage from '../config/multerconfig';
import { uploadImage } from '../config/cloudinaryconfig';

exports.createPost = (req, res) => {

  parseImage(req, res, function(err) {
    const { title, category, body } = req.body;

    if (err) {
      return res.status(500).send(err)
    }

    const file = req.files.postImage[0].path;

    uploadImage(file)
    .then((result) => {
      console.log(result.url);

      const postImage = result.url;
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
    })
    .catch(err => console.error(err));
  })
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

