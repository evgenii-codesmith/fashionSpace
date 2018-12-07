require('dotenv').config();

// requirements for using geoip library
const GeoIP = require('simple-geoip');
const cities = require('cities');
const db = require('../models/db');

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

  db.any('UPDATE users SET city_id = $1 WHERE id = $2', values)
    .then((data) => {
      console.log('Successfully updated city ID');
      next();
    })
    .catch((err) => {
      console.error('Error updating city for user');
      return res.sendStatus(500)
    })
};

userController.getCity = async (req, res, next) => {
  // Middleware that grabs IP address of the client; should be able to be
  // done based on requests but have not done yet; set to Los Angeles
  // const ipaddress = '74.87.214.86';
  // // Throw an error if there is an issue with the ipaddress
  // if (!ipaddress) return res.send('Cannot get ipaddress');
  // // Savve the ipaddress into res.locals
  // res.locals.ipaddress = ipaddress;
  const {lat, lng} = req.body;
  console.log('lat:', lat, 'lng: ', lng);

  res.locals.lat = lat;
  res.locals.lng = lng;

  const userCity = await cities.gps_lookup(lat, lng);
  res.locals.city = userCity.city;
  res.locals.state =  userCity.state_abbr;
  console.log(res.locals.lat, res.locals.lng);
  next();
};

// userController.grabLocation = (req, res, next) => {
//   geoip.lookup('74.87.214.86', (err, data) => {
//     if (err) throw err;
//     else {
//       res.locals.state = data.location.region;
//       res.locals.city = data.location.city;
      
//       return next();
//     }
//   });
// };

module.exports = userController;
