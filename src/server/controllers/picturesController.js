require('dotenv').config();
const CLOUDINARY_UPLOAD_URL = process.env.CLOUDINARY_UPLOAD_URL;
const CLOUDINARY_UPLOAD_PRESET = process.env.CLOUDINARY_UPLOAD_PRESET
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
const db = require('../models/db');

const picturesController = {};

picturesController.grabPics = (req, res, next) => {
  console.log('grabbing pictures');
  db.any('SELECT id, url, user_id, likes, description FROM media WHERE city_id = $1', [res.locals.cityid])
    .then((data) => {
      let returnData = {};
      returnData = data.reduce((accum, el) => {
        let id = el.id;
        accum[id] = {
          'url': el.url,
          'user_id' : el.user_id,
          'likes' : el.likes,
          'description' : el.description,
        };
        return accum;
      }, returnData);
      return res.json(returnData);
    })
    .catch((error) => {
      console.log(error);
      res.send('ERROR! cannot grab links from database');
    });
};

picturesController.uploadPicture = (req, res, next) => {
  console.log('uploading pictures');
  // const { userUuid, uploadedFileCloudinaryUrl, uploadText, uploadStyleClickNightOut, uploadStyleClickOutDoor } = req.body;
  // db.any('INSERT INTO pictures(id, userid, city, latitude, longitude, likes, description, date, picture_url, style_nightlife, style_outdoor) VALUES (uuid_generate_v4(), $1, $2, $3, $4, $5, $6, $7, $8, $9, $10);'
  // , [userUuid, res.locals.cityid, res.locals.latitude, res.locals.longitude, 0, uploadText, null, uploadedFileCloudinaryUrl, uploadStyleClickNightOut, uploadStyleClickOutDoor])
  //   .then((data) => {
  //     console.log('Success storing picture info');
  //     return res.json(data);
  //   })
  //   .catch((error) => {
  //     console.log(error);
  //     return res.send('ERROR! Could not save picture to database');
  //   });
 
  const { uploadedFileCloudinaryUrl, uploadText } = req.body;
  console.log('req.body: ', req.body);
  db.any('INSERT INTO media(user_id, city_id, created_at, url, likes, description) VALUES ($1, $2, $3, $4, $5, $6);'
  , [req.cookies.userid, res.locals.cityid, new Date(), uploadedFileCloudinaryUrl, 0, uploadText])
    .then((data) => {
      console.log('Success storing picture info');
      return res.json(data);
    })
    .catch((error) => {
      console.log(error);
      return res.send('ERROR! Could not save picture to database');
    });
 };

module.exports = picturesController;
