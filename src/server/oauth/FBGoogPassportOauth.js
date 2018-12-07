const FBStrategy = require('passport-facebook');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const FACEBOOK_APP_ID = '984164858454990';
const FACEBOOK_APP_SECRET = '9084525cd444587eca85b74829c0c89c';

const GOOGLE_CLIENT_ID = '59793379530-80nrdao98gmkufi8f4te6k46rut0l3ob.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = 'pkRyXeQwjlcbJbRHQ7QAu1ln';

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

passport.use(new FBStrategy({
  clientID: FACEBOOK_APP_ID,
  clientSecret: FACEBOOK_APP_SECRET,
  callbackURL: 'http://localhost:3000/FBCallback',
},
(accessToken, refreshToken, profile, cb) => {
  console.log('profileID: ', profile.id);
  // return accessToken;
  // User.findOrCreate({ facebookId: profile.id }, function (err, user) {
  //   return cb(err, user);
  // });
  cb(null, { id: profile.id });
},
));

passport.use(new GoogleStrategy({
  clientID: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  callbackURL: 'http://localhost:3000/GOCallback',
},
(accessToken, refreshToken, profile, cb) => {
  console.log('profileID: ', profile.id);
  return cb(null, { id: profile.id });
}));

module.exports = passport;
