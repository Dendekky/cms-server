import cloudinary from 'cloudinary';
// import fs from 'fs';
require('dotenv').config();
import { production } from './config'

cloudinary.config({
  cloud_name: production.cloudName,
  api_key: production.apiKey,
  api_secret: production.apiSecret,
});
// const uniqueFilename = new Date().toISOString();

exports.uploadImage = file =>
// cloudinary.uploader.upload(
//     file,
//     // { public_id: `Assets/${uniqueFilename}`, tags: `blog` }, // directory and tags are optional
//     (data) => {
//       if (data) {
//         // console.log(data.url);
//         return res.status(201).json(data)
//       }
//     //   console.log(err.public_id);
//     //   fs.unlinkSync(file)

//     //   res.status(201).json(image)
//     }
// )
  new Promise((resolve) => {
    cloudinary.uploader.upload(
      file,
      (result) => {
        resolve({ url: result.url, id: result.public_id });
      },
      { resource_type: 'auto' },
    );
  });
