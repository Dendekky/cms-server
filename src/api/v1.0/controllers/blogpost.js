// import { check, body, validationResult } from 'express-validator';
import fetch from 'node-fetch';
import BlogPost from '../models/blogpost';
import PostComment from '../models/comments';
import parseImage from '../config/multerconfig';
import { uploadImage } from '../config/cloudinaryconfig';
import { sendNewCommentNotificationEmail, sendNewPostNotificationEmail } from '../services/mails';


const ReBuildClientWebhook = () => {
  fetch('https://api.vercel.com/v1/integrations/deploy/QmeHECbNq9vDkDKo6MHMLKAfhfkkY7wudcSpdnEWKKw7fe/6gzAA6PmZA', {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
  })
    .then(res => res.json())
    .then(json => console.log(json))
    .catch(err => console.log(err));
};

const CreateSecureImageUrl = (url) => {
  if (url.slice(0, 6) === 'https:') {
    return url;
  }
  return `${url.substr(0, 4)}s${url.substr(4)}`;
};

exports.createPost = (req, res) => {
  parseImage(req, res, async (err) => {
    const {
      title, category, body, tags, excerpt,
    } = req.body;

    if (err) {
      return res.status(500).send(err);
    }
    const file = req.files && req.files.postImage ? req.files.postImage[0].path : req.body.postImage;
    const postImageFile = req.files && req.files.postImage ? await uploadImage(file) : file;
    const postImage = req.files && req.files.postImage
      ? (CreateSecureImageUrl(`${postImageFile.url.substr(0, 47)}/q_auto,f_auto${postImageFile.url.substr(47)}`)) : postImageFile;
    const postTags = tags ? tags.split(',') : [];
    const slug = title ? title.replace(/[^a-zA-Z ]/g, '').toLowerCase().split(' ').join('-') : '';

    const post = new BlogPost({
      title,
      category,
      excerpt,
      tags: postTags,
      body,
      postImage,
    });
    post.slug = `${slug}-${post._id}`;

    post.save(async (err) => {
      if (err) {
        return res.status(500).send({
          message: err.message,
        });
      }
      await sendNewPostNotificationEmail(title, post.slug, post.excerpt, post.postImage);

      ReBuildClientWebhook();
      res.status(201).send({
        message: 'published post to blog',
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

exports.getPostsByTag = (req, res) => BlogPost.find({ tags: { $in: [req.params.tag] } }, (err, posts) => {
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

exports.getPostsByCategory = (req, res) => BlogPost.find({ category: req.params.category }, (err, posts) => {
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

exports.getPost = async (req, res) => {
  try {
    const post = await BlogPost.findOne({ slug: req.params.slug })
      .lean()
      .populate('comments');
    if (!post) {
      return res.status(500).send({
        message: 'Internal server error',
      });
    }
    if (post) {
      const allPost = await BlogPost.find();
      const relatedPosts = allPost.filter(blogpost => blogpost.tags.some(val => post.tags.includes(val)));
      post.relatedPosts = relatedPosts;
      post.commentsLength = post.comments.length;
    }
    if (post && post.comments) {
      const rec = (comment, threads) => {
        for (const thread in threads) {
          const value = threads[thread];
          if (thread.toString() === comment.parentId.toString()) {
            value.children[comment._id] = comment;
            return;
          }
          if (value.children) {
            rec(comment, value.children);
          }
        }
      };
      const threads = {}; let
        comment;
      for (let i = 0; i < post.comments.length; i++) {
        comment = post.comments[i];
        comment.children = {};
        const { parentId } = comment;
        if (!parentId) {
          threads[comment._id] = comment;
          continue;
        }
        rec(comment, threads);
      }
      post.comments = threads;
    }
    return res.status(200).json(post);
  } catch (err) {
    res.send({ message: err.message });
  }
};

exports.updatePost = async (req, res) => {
  parseImage(req, res, async (err) => {
    const {
      title, category, body, tags, excerpt
    } = req.body;

    if (err) {
      return res.status(500).send({ message: err.message });
    }
    const file = req.files && req.files.postImage ? req.files.postImage[0].path : req.body.postImage;
    const postImageFile = req.files && req.files.postImage ? await uploadImage(file) : file;
    const postImage = req.files && req.files.postImage
      ? (CreateSecureImageUrl(`${postImageFile.url.substr(0, 47)}/q_auto,f_auto${postImageFile.url.substr(47)}`)) : postImageFile;
    const data = {
      title, category, body, postImage, tags, excerpt,
    };
    BlogPost.findByIdAndUpdate(
      req.params.id, data,
      { upsert: true }, (err, post) => {
        if (err) {
          return res.status(500).send({
            message: err.message,
          });
        }
        ReBuildClientWebhook();
        res.status(201).send({
          message: post,
        });
      },
    );
  });
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
  const {
    name, message, postId, postTitle, slug,
  } = req.body;
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
          message: err.message,
        });
      }
      sendNewCommentNotificationEmail(name, message, postTitle, slug);

      ReBuildClientWebhook();
      return res.status(201).send({
        message: 'Comment added to list',
      });
    });
  } catch (err) {
    res.status(500).send(err);
  }
};
