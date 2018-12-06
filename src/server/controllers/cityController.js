const db = require('../models/db')
const cityController = {};

cityController.grabCityId = (req, res, next) =>{
  const{ city, state } = res.locals;
  const values = [city, state];
  db.any('SELECT id FROM city WHERE (name = $1 AND state = $2)', values)
    .then((data) => {
      res.locals.cityid = data[0].id;
      next();
    })
    .catch((err) => {
      console.error('Cannot find city in database');
      return res.sendStatus(500);
    })
}

module.exports = cityController;