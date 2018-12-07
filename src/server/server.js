const path = require('path');
// necessary requirements to use express
const db = require('./models/db.js');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const userController = require('./controllers/userController');
const cityController = require('./controllers/cityController');
const picturesController = require('./controllers/picturesController');
// const passport = require('./oauth/FBGoogPassportOauth');
const FBOauth = require('./oauth/FBRawOauth');

const app = express();
const PORT = 3000;

// requirements for using geoip library
// const GeoIP = require('simple-geoip');
// const geoip = new GeoIP(process.env.geoipkey);

// localhost:3000
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/../../dist'));

// app.use(passport.initialize());
// app.use(passport.session());
app.use(cors());

// automatically call getIpAddress and grabLocation
// app.use(userController.getCity, cityController.grabCityId);


// *** NEW ROUTES BY EVGENTI JIM
app.post('/login', userController.grabUserId, userController.updateCityId, (req, res) => {
  return res.json(res.locals.userid);
});

app.get('/pictures', picturesController.grabPics);

app.post('/uploadPicture', picturesController.uploadPicture);

// app.get('/googleOauth', passport.authenticate('google', { scope: ['profile'] }));

// app.get('/GOCallback', passport.authenticate('google', { failureRedirect: '/login' }),
//   (req, res) => {
//     console.log('success google oauth');
//     console.log('GL session: ', req.session.passport.user);
//     res.json(req.session.passport.user);
//   // Successful authentication, redirect home.
//     // res.redirect('/');
//   });

// facebook passport oauth
// app.get('/FBOauth', passport.authenticate('facebook'));

// app.get('/FBCallback', passport.authenticate('facebook', { failureRedirect: '/login' }),
//   (req, res) => {
//     console.log('success facebook oauth');
//     console.log('fb session: ', req.session.passport.user);
//     res.json(req.session.passport.user);
//   // Successful authentication, redirect home.
//     // res.redirect('/');
//   });

// Facebook raw OAuth
app.get('/FBOauth', FBOauth.FBRedirect);

app.get('/FBCallback', FBOauth.callback,
  (req, res) => {
    console.log('success2 facebook oauth');
  // Successful authentication, redirect home.
    // res.redirect('/');
  });

// check if server is online and connected
app.listen(PORT, (err) => {
  if (err) console.log(err);
  else console.log(`Server listening on Port: ${PORT}...`);
});

// app.get('/pictures', getIpAddress, (req,res) => {
//   const geo = geoip.lookup(res.locals.ipaddress);
// })
