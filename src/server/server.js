const path = require('path');
// necessary requirements to use express
const db = require('./models/db.js');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
require('dotenv').config();

const userController = require('./controllers/userController');
const cityController = require('./controllers/cityController');
const picturesController = require('./controllers/picturesController');
const cookieController = require('./util/cookieController');

const app = express();
const PORT = 3000;

// localhost:3000
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../../dist/')));

// automatically call getIpAddress and grabLocation
app.use(cookieController.checkInfo, userController.getCity, cityController.grabCityId, userController.startSession);

// *** NEW ROUTES BY EVGENTI JIM
// app.get('/', (req, res) => {
//   res.send();
// });

app.post('/login', userController.grabUserId, userController.updateCityId, (req, res) => {
  console.log('almost done with login');
  cookieController.setCookie(req, res);
  return res.send('');
});

app.get('/pictures', picturesController.grabPics);

app.post('/uploadPicture', picturesController.uploadPicture);

// check if server is online and connected
app.listen(PORT, (err) => {
  if (err) console.log(err);
  else console.log(`Server listening on Port: ${PORT}...`);
});
