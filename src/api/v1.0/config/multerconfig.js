import multer from 'multer';

const storage = multer.diskStorage({
  // destination: function(req, file,cb){
  //     if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
  //         cb(null, 'src/api/v1.0/config/uploads/')
  //         // cb(null, './files/images/');
  //     }else{
  //         cb({message: 'this file is neither a video or image file'}, false)
  //     }},
  filename(req, file, cb) {
    cb(null, file.originalname);
  },
});

const parseImage = multer({ storage }).fields([
  {
    name: 'title',
  },
  {
    name: 'category',
  },
  {
    name: 'body',
  },
  {
    name: 'postImage',
  },
]);

module.exports = parseImage;
