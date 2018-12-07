const cookieController = {};

cookieController.setCookie = (req, res, next) => {
  res.cookie('fashion', 'space');
  res.cookie('lat', res.locals.lat);
  res.cookie('lng', res.locals.lng);
  res.cookie('city_id', res.locals.cityid);
  res.cookie('userid', res.locals.userid);
};

cookieController.checkInfo = (req, res, next) => {
  if (Object.keys(req.cookies).length < 2) {
    const { lat, lng } = req.body;
    res.locals.lat = lat;
    res.locals.lng = lng;
    return next();
  }
  const keys = Object.keys(req.cookies);
  const values = Object.values(req.cookies);
  for (let i = 0; i < keys.length; i += 1) {
    res.locals[keys[i]] = values[i];
  }
  next();
};
module.exports = cookieController;
