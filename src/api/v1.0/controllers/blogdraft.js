import BlogDraft from '../models/blogDraft';
import { check, body, validationResult } from 'express-validator';


const createDraft = [
  check('title').isLength({ min: 3 }).withMessage('Please input a title'),
  body('category').isLength({ min: 3 }).withMessage("input category"),
  check('body').isLength({ min: 3 }).withMessage('Please input the blog'),

   (req, res) =>{
       const errors = validationResult(req);
       if(!errors.isEmpty()) {
           res.status(406).send({ 
               errors: errors.array(),
               status: 406
            })
       } else {
        const title = req.body.title;
        const category = req.body.category;
        const body = req.body.body;
        const metadata = req.body.metadata
 
        const draft = new BlogDraft({
            title,
            category,
            body,
            metadata
         })
        draft.save((err) =>{
            if (err) {
                return res.status(500).send({
                    status: 500,
                    message: 'Internal server error'
                }) 
            }
            res.status(201).send({
                status: 201,
                success: 'saved to draft'
            })
        }) 

    }
       
   }
]

const getAllDrafts = (req, res) => {
    BlogDraft.find({}, (err, drafts) => {
        if(err) {
            res.status(500).send({
                status: 500,
                message: 'Internal server error'
            })
        }
        res.status(200).send({
            status: 200,
            drafts: drafts
        });
    });
}

const getDraft = (req, res) => {
    BlogDraft.findById(req.params.id, (err, draft) => {
        if(err) {
            res.status(500).send({
                message: 'Internal server error'
            })
        }
        res.status(200).send({
            draft: draft
        })
    });
}

const updateDraft = (req, res) => {
    BlogDraft.findByIdAndUpdate(req.params.id, req.body, {upsert: true}, (err, draft) => {
        if(err) {
            res.status(500).send({
                message: 'Internal server error'
            })
        }
        res.status(201).send({
            message: 'update successful'
        })
    });
}

const deleteDraft = (req, res) => {
    AssignedTalk.findByIdAndRemove(req.params.id)
    .then(res.redirect('/api/talks'))
        res.redirect('/api/talks')
}

module.exports = {
    createDraft,
    getAllDrafts,
    getDraft,
    updateDraft,
    deleteDraft
}

