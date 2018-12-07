require('dotenv').config();
const db = require('../models/db')

// requirements for using geoip library
const cities = require('cities');
const db = require('../models/db');

const cookieController = require('../util/cookieController');

const userController = {};

userController.startSession = (req, res, next) => {
  console.log('starting session');
  cookieController.setCookie(req, res);
  next();
};

userController.grabUserId = (req, res, next) => {
  console.log('grabbing user id');
  const { username, password } = req.body;
  const values = [username, password];
  db.any('SELECT id FROM users WHERE (username = $1 AND password = $2)', values)
    .then((data) => {
      // console.log('hellooo', data);
      res.locals.userid = data[0].id;
      next();
    })
    .catch((err) => {
      console.error('Cannot find user in database');
      return res.sendStatus(500);
    });
};

userController.updateCityId = (req, res, next) => {
  console.log('updating city id');
  const { cityid, userid } = res.locals;
  const values = [cityid, userid];

  db.any('UPDATE users SET city_id = $1 WHERE id = $2', values)
    .then((data) => {
      console.log('Successfully updated city ID');
      next();
    })
    .catch((err) => {
      console.error('Error updating city for user');
      return res.sendStatus(500);
    });
};

userController.getCity = async (req, res, next) => {
  console.log('getting city lat long)');
  const { lat, lng } = res.locals;
  const userCity = await cities.gps_lookup(lat, lng);
  res.locals.city = userCity.city;
  res.locals.state = userCity.state_abbr;
  next();
};

module.exports = userController;
