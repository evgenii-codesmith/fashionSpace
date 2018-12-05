require('dotenv').config();
// requirements for using geoip library
const GeoIP = require('simple-geoip');

const geoip = new GeoIP(process.env.geoipkey);

const userController = {};

userController.grabUserId = (req, res, next) => {
  const { username, password } = req.body;
  const values = [username, password];
  db.any('SELECT id FROM users WHERE (username = $1 AND password = $2)', values)
    .then((data) => {
      res.locals.userid = data[0].id;
      next();
    })
    .catch((err) => {
      console.error('Cannot find user in database');
      return res.sendStatus(500);
    });
};

userController.updateCityId = (req, res, next) => {
  const { cityid, userid } = res.locals;
  const values = [cityid, userid];
  db.any('UPDATE users SET city = $1 WHERE id = $2', values)
    .then((data) => {
      console.log('Successfully updated city ID');
      next();
    })
    .catch((err) => {
      console.error('Error updating city for user');
      return res.sendStatus(500)
    })
};

userController.getIPaddress = (req, res, next) => {
  // Middleware that grabs IP address of the client; should be able to be
  // done based on requests but have not done yet; set to Los Angeles
  const ipaddress = '74.87.214.86';
  // Throw an error if there is an issue with the ipaddress
  if (!ipaddress) return res.send('Cannot get ipaddress');
  // Savve the ipaddress into res.locals
  res.locals.ipaddress = ipaddress;
  next();
};

userController.grabLocation = (req, res, next) => {
  geoip.lookup('74.87.214.86', (err, data) => {
    if (err) throw err;
    else {
      res.locals.state = data.location.region;
      res.locals.city = data.location.city;
      res.locals.latitude = data.location.lat;
      res.locals.longitude = data.location.lng;
      return next();
    }
  });
};

module.exports = userController;
