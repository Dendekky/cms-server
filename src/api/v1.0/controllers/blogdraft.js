import { check, body, validationResult } from 'express-validator';
import BlogDraft from '../models/blogdraft';
import parseImage from '../config/multerconfig';
import { uploadImage } from '../config/cloudinaryconfig';

const createDraft = async (req, res) => {
  parseImage(req, res, async (err) => {
    const { title, category, body } = req.body;

    if (err) {
      return res.status(500).send(err);
    }
    const file = req.files && req.files.postImage ? req.files.postImage[0].path : "";

    const postImageFile = file ? await uploadImage(file) : ""
    const postImage = postImageFile.url || ""
    const draft = new BlogDraft({
      title,
      category,
      body,
      postImage,
    });
    draft.save((err) => {
      if (err) {
        return res.status(500).send({
          message: 'Internal server error',
        });
      }
      res.status(201).send({
        success: 'saved to draft',
      });
    });
  });
};


const updateDraft = async (req, res) => {
    parseImage(req, res, async (err) => {
      const { title, category, body } = req.body;
  
      if (err) {
        return res.status(500).send(err);
      }
      const file = req.files && req.files.postImage ? req.files.postImage[0].path : req.body.postImage;  
      const postImageFile = req.files && req.files.postImage ? await uploadImage(file) : file
      const postImage = postImageFile.url || postImageFile
      const data = { title, category, body, postImage }
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
  })
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
