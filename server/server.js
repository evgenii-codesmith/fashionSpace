// necessary requirements to use express
const db = require('./db.js');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

// requirements for using geoip library
require('dotenv').config();
const GeoIP = require('simple-geoip');

const geoip = new GeoIP(process.env.geoipkey);

// localhost:3000
const PORT = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));
app.use(express.static(__dirname + '/../../dist'));

// automatically call getIpAddress and grabLocation
app.use(getIpAddress, grabLocation)

// check if server is online and connected
app.listen(PORT, (err) => {
  if (err) console.log(err);
  else console.log(`Server listening on Port: ${PORT}...`);
});

function getIpAddress(req, res, next)  {
// Middleware that grabs IP address of the client; should be able to be
// done based on requests but have not done yet; set to Los Angeles
  const ipaddress = '74.87.214.86';
  // Throw an error if there is an issue with the ipaddress
  if (!ipaddress) { return res.send('Cannot get ipaddress') }
  // Savve the ipaddress into res.locals
  res.locals.ipaddress = ipaddress;
  next();
}

function grabLocation (req, res, next) {
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
}
// app.get('/pictures', getIpAddress, (req,res) => {
//   const geo = geoip.lookup(res.locals.ipaddress);
// })
function grabUserId (req, res, next) {
  console.log(req.body.username);
  console.log(req.body.password)
  db.any('SELECT id FROM users WHERE (username = $1 AND password = $2)', [req.body.username, req.body.password])
    .then((data) => {
      res.locals.userid = data[0].id;
      next();
    })
    .catch((err) => {
      console.error('Cannot find user in database');
      return res.sendStatus(500);
    });
}
function grabCityId (req, res, next) {
  db.any('SELECT id FROM city WHERE (name = $1 AND state = $2)', [res.locals.city, res.locals.state])
    .then((data) => {
      res.locals.cityid = data[0].id;
      next();
    })
    .catch((err) => {
      console.error('Cannot find city in database');
      return res.sendStatus(500);
    })
}

function updateCityId (req, res, next) {
  db.any('UPDATE users SET city = $1 WHERE id = $2', [res.locals.cityid, res.locals.userid])
    .then((data) => {
      console.log('Successfully updated city ID');
      res.json(data);
    })
    .catch((err) => {
      console.error('Error updating city for user');
      return res.sendStatus(500)
    })
}
function grabPics (req, res, next) {
  console.log(res.locals.cityid)
  db.any('SELECT picture FROM pictures WHERE city = $1', [res.locals.cityid])
    .then((data) => {
      return res.json(data)
    })
    .catch((error) => {
      console.log(error);
      res.send('ERROR! cannot grab links from database')
    })
}

app.get('/pictures', grabCityId, grabPics);

app.post('/login', grabUserId, grabCityId, updateCityId);

// testing connection to database 
app.post('/city', (req, res, next) => {
  db.any('INSERT INTO city(id, name, state) VALUES (uuid_generate_v4(), $1, $2);', [res.locals.city, res.locals.state])
    .then((data) => {
      // success;
      console.log('Success.');
      res.json(data);
      next();
    })
    .catch((error) => {
      // error;
      console.log(error);
      res.send('ERROR! Could not send to database');
    });
});