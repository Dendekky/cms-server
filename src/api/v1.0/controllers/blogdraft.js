import { check, body, validationResult } from 'express-validator';
import BlogDraft from '../models/blogdraft';
import parseImage from '../config/multerconfig';
import { uploadImage } from '../config/cloudinaryconfig';

const CreateSecureImageUrl = (url) => {
  if (url.slice(0, 6) === "https:") {
    return url
  } else {
    return `${url.substr(0, 4)}s${url.substr(4)}`
  }
}

const createDraft = async (req, res) => {
  parseImage(req, res, async (err) => {
    const {
      title, category, body, tags,
    } = req.body;

    if (err) {
      return res.status(500).send(err);
    }
    const file = req.files && req.files.postImage ? req.files.postImage[0].path : '';
    const postImageFile = req.files && req.files.postImage ? await uploadImage(file) : '';
    const postImage = req.files && req.files.postImage ? (CreateSecureImageUrl(`${postImageFile.url.substr(0, 47)}/q_auto,f_auto${postImageFile.url.substr(47)}`)) : '';
    const postTags = tags ? tags.split(',') : [];
    const draft = new BlogDraft({
      title,
      category,
      tags: postTags,
      body,
      postImage,
    });
    console.log(draft)
    draft.save((err) => {
      if (err) {
        return res.status(500).send({
          message: 'Internal server error',
        });
      }
      res.status(201).send({
        message: 'saved to draft',
      });
    });
  });
};


const updateDraft = async (req, res) => {
  parseImage(req, res, async (err) => {
    const {
      title, category, body, tags,
    } = req.body;

    if (err) {
      return res.status(500).send({ message: err.message });
    }
    const file = req.files && req.files.postImage ? req.files.postImage[0].path : req.body.postImage;
    const postImageFile = req.files && req.files.postImage ? await uploadImage(file) : file;
    const postImage = req.files && req.files.postImage ? (CreateSecureImageUrl(`${postImageFile.url.substr(0, 47)}/q_auto,f_auto${postImageFile.url.substr(47)}`)) : postImageFile;
    const postTags = tags ? tags.split(',') : [];

    const data = {
      title, category, body, postImage, tags: postTags,
    };
    BlogDraft.findByIdAndUpdate(
      req.params.id, data,
      { upsert: true }, (err, draft) => {
        if (err) {
          return res.status(500).send({
            message: err.message,
          });
        }
        res.status(201).send({
          message: draft,
        });
      },
    );
  });
};

const getAllDrafts = (req, res) => BlogDraft.find({}, (err, drafts) => {
  if (err) {
    return res.status(500).send({
      status: 500,
      message: err.message,
    });
  }
  res.status(200).send({
    status: 200,
    drafts,
  });
});

const getDraft = (req, res) => BlogDraft.findById(req.params.id, (err, draft) => {
  if (err) {
    return res.status(500).send({
      message: err.message,
    });
  }
  res.status(200).send({
    draft,
  });
});

const deleteDraft = (req, res) => BlogDraft.findByIdAndRemove(req.params.id, (err, del) => {
  if (err) {
    return res.status(500).send({
      message: err.message,
    });
  }
  res.status(200).send({
    message: 'post deleted',
  });
});


module.exports = {
  createDraft,
  getAllDrafts,
  getDraft,
  updateDraft,
  deleteDraft,
};
