const { Router } = require("express");
const express = require("express");
const passport = require("passport");

const router = express.Router();

const successLoginUrl = "http://localhost:5173/";
const errorLoginUrl = "http://localhost:3000/login/error";

router.get(
  "/login/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureMessage: "Cannot Login to Google , Please try again Later",
    failureRedirect: errorLoginUrl,
    successRedirect: successLoginUrl,
  }),
  (req, res) => {
    req.session.save(function (err) {
      console.log("User", req.user);
      res.status(200).json({
        message: req.user,
        statuscode: 200,
      });
    });
  }
);

module.exports = router;
