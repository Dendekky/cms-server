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
    const file = req.files && req.files.postImage ? req.files.postImage[0].path : req.body.postImage;  
    const postImageFile = req.files && req.files.postImage ? await uploadImage(file) : file
    const postImage = req.files && req.files.postImage ? (postImageFile.url.substr(0, 47) + "/q_auto,f_auto" + postImageFile.url.substr(47)) : postImageFile

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
          message: err.message,
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
    return res.status(500).send({
      status: 500,
      message: err.message,
    });
  }
  res.status(200).send({
    status: 200,
    posts,
  });
});

exports.getPost = (req, res) => BlogPost.findOne({ _id: req.params.id })
  .lean()
  .populate('comments')
  .then((post) => {
    if (!post) {
      return res.status(500).send({
        message: 'Internal server error',
      });
    }
    if (post && post.comments) {
        const rec = (comment, threads) => {
          for (var thread in threads) {
            let value = threads[thread];
            if (thread.toString() === comment.parentId.toString()) {
                value.children[comment._id] = comment;
                return;
            }
            if (value.children) {
                rec(comment, value.children)
            }
          }
        }
        let threads = {}, comment
        for (let i=0; i < post.comments.length; i++) {
            comment = post.comments[i]
            comment['children'] = {}
            let parentId = comment.parentId
            if (!parentId) {
                threads[comment._id] = comment
                continue
            }
          rec(comment, threads)
        }
        post.comments = threads
    }
    return res.status(200).json(post);
  })
  .catch((err) => {
    res.send(err.message);
  });

exports.updatePost= async (req, res) => {
  parseImage(req, res, async (err) => {
    const { title, category, body } = req.body;

    if (err) {
      return res.status(500).send(err.message);
    }
    const file = req.files && req.files.postImage ? req.files.postImage[0].path : req.body.postImage;  
    const postImageFile = req.files && req.files.postImage ? await uploadImage(file) : file
    const postImage = req.files && req.files.postImage ? (postImageFile.url.substr(0, 47) + "/q_auto,f_auto" + postImageFile.url.substr(47)) : postImageFile
    const data = { title, category, body, postImage }
    BlogPost.findByIdAndUpdate(
      req.params.id, data,
      { upsert: true }, (err, post) => {
        if (err) {
          return res.status(500).send({
            message: err.message,
          });
        }
        res.status(201).send({
          message: post,
        });
      },
    );
})
};

exports.deletePost = (req, res) => BlogPost.findByIdAndRemove(req.params.id, (err, del) => {
  if (err) {
    res.status(500).send({
      message: err.message,
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
