const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("./../models/user");
var mongoose = require("mongoose");
var ObjectID = require("mongodb").ObjectId;

const CALLBACK_URL = "http://localhost:3000/api/v1/google/callback";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: CALLBACK_URL,
      passReqToCallback: true,
    },
    async (req, aceesToken, refreshToken, profile, cb) => {
      console.log(profile);
      const user = await User.findOne({ googleId: profile.id }).then(
        (existingUser) => {
          if (existingUser) {
            req.session.CurrentUser = existingUser;
            console.log(req.session.CurrentUser);
            return cb(null, existingUser);
          } else {
            new User({
              name: profile.name.givenName,
              email: profile.emails[0].value,
              picture: profile.photos[0].value,
              googleId: profile.id,
            })
              .save()
              .then((user) => {
                req.session.CurrentUser = user;
                cb(null, user);
              });
          }
        }
      );

      console.log(req.session.id);

      if (user && user[0]) return cb(null, user && user[0]);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  console.log("desearializing user");
  console.log(user);
  done(null, user);
});
