import BlogPost from '../models/blogpost';
import { check, body, validationResult } from 'express-validator';


exports.createPost = [
  check('title').isLength({ min: 3 }).withMessage('Please input a title'),
  body('category').isLength({ min: 3 }).withMessage("input category"),
  check('body').isLength({ min: 3 }).withMessage('Please input the blog'),
  check('metadata').isLength({ min: 3 }).withMessage('Please input the summary'),

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
        const postImage = req.body.postImage
 
        const post = new BlogPost({
            title,
            category,
            body,
            metadata,
            postImage
         })
        post.save((err) =>{
            if (err) {
                return res.status(500).send({
                    status: 500,
                    message: 'Internal server error'
                }) 
            }
            res.status(201).send({
                status: 201,
                success: 'saved to post'
            })
        }) 

    }
       
   }
]

exports.getAllPosts = (req, res) => 
    BlogPost.find({}, (err, posts) => {
        if(err) {
            res.status(500).send({
                status: 500,
                message: 'Internal server error'
            })
        }
        res.status(200).send({
            status: 200,
            posts: posts
        });
    });


exports.getPost = (req, res) => 
    BlogPost.findById(req.params.id, (err, post) => {
        if(err) {
            res.status(500).send({
                message: 'Internal server error'
            })
        }
        res.status(200).send({
            post: post
        })
    });


exports.updatePost = [
    check('title').isLength({ min: 3 }).withMessage('Please input a title'),
    body('category').isLength({ min: 3 }).withMessage("input category"),
    check('body').isLength({ min: 3 }).withMessage('Please input the blog'),
    check('metadata').isLength({ min: 3 }).withMessage('Please input the summary'),
  
     (req, res) =>{
         const errors = validationResult(req);
         if(!errors.isEmpty()) {
             res.status(406).send({ 
                 errors: errors.array(),
                 status: 406
              })
         } else {
            BlogPost.findByIdAndUpdate(
                req.params.id, req.body, 
                {upsert: true}, (err, post) => {
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
    }
]


exports.deletePost = (req, res) => 
    BlogPost.findByIdAndRemove(req.params.id)
    .then(res.redirect('/api/talks'))


// module.exports = {
//     createPost,
//     getAllPosts,
//     getPost,
//     updatePost,
//     deletePost
// }
