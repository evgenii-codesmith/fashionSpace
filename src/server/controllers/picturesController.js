const picturesController = {};

picturesController.grabPics = (req, res, next) => {
  console.log(res.locals.cityid);
  db.any('SELECT id, picture_url, userid, likes, description, style_nightlife, style_outdoor FROM pictures WHERE city = $1', [res.locals.cityid])
    .then((data) => {
      let returnData = {};
      returnData = data.reduce((accum, el) => {
        let id = el.id;
        accum[id] = {
          'picture_url': el.picture_url,
          'userid' : el.userid,
          'likes' : el.likes,
          'description' : el.description,
          'style_nightlife' : el.style_nightlife,
          'style_outdoor' : el.style_outdoor,
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
  const { userUuid, uploadedFileCloudinaryUrl, uploadText, uploadStyleClickNightOut, uploadStyleClickOutDoor } = req.body;
  db.any('INSERT INTO pictures(id, userid, city, latitude, longitude, likes, description, date, picture_url, style_nightlife, style_outdoor) VALUES (uuid_generate_v4(), $1, $2, $3, $4, $5, $6, $7, $8, $9, $10);'
  , [userUuid, res.locals.cityid, res.locals.latitude, res.locals.longitude, 0, uploadText, null, uploadedFileCloudinaryUrl, uploadStyleClickNightOut, uploadStyleClickOutDoor])
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
