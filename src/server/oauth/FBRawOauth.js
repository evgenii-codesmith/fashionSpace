const oauthController = {};
const request = require('request');
const qs = require('query-string');

oauthController.FBRedirect = (req, res) => {
  console.log('hit oauth redirect');
  const requestURL = 'https://www.facebook.com/v3.2/dialog/oauth?'
  + 'client_id=984164858454990&'
  + 'redirect_uri=http://localhost:3000/FBCallback';
  // + '&state={"{st=state123abc,ds=123456789}"}';

  console.log('requestURL: ', requestURL);
  res.redirect(requestURL);

};

oauthController.callback = (req, res, next) => {
  const authCode = req.query.code;
  const requestURL = 'https://graph.facebook.com/v3.2/oauth/access_token?'
  + 'client_id=984164858454990&'
  + 'redirect_uri=http://localhost:3000/FBCallback&'
  + 'client_secret=9084525cd444587eca85b74829c0c89c&'
  + `code=${authCode}`;
  request.post(requestURL, (err, response, body) => {
    console.log('body: ', body);
    console.log('json parse: ', JSON.parse(body));
    console.log('token: ', JSON.parse(body).access_token);

    if (err) return console.log('callback oauth error');
    // res.locals.id = token;
    res.cookie('token', 1234);
    next();
  });
};

module.exports = oauthController;
