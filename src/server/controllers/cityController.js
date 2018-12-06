const db = require('../models/db');
const cityController = {};

cityController.grabCityId = (req, res, next) => {
  const { city, state } = res.locals;

  const values = [city, state];

  //Check if city exists in db
  db.any('SELECT id FROM city WHERE (name = $1 AND state = $2)', values)
    .then((data) => {
      console.log('data: ', data);
      
      res.locals.cityid = data[0].id;
      next();
    })
    .catch((err) => {
      //Instert new city to db
      db.one('INSERT INTO city(name, state, lat, long) VALUES ($1, $2, $3, $4) RETURNING id', [city, state, res.locals.lat, res.locals.lng ])
      .then(data => {
        console.log(data.id); // print new user id;
      })
      .catch(error => {
        console.log('ERROR:', error); // print error;
      });



      console.error('Cannot find city in database');
      return res.sendStatus(500);
    });
};

module.exports = cityController;
