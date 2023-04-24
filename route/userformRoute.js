const express = require("express");
const router = express.Router();
const users = require("./../controller/userController");
const passport = require("passport");

router.route("/register").post(users.register);

router.route("/login").post(
  passport.authenticate("local", {
    failureRedirect: "/arts",
    failureRedirect: "http://127.0.0.1:5173/",
    failureMessage: true,
    keepSessionInfo: true,
  }),
  users.login
);

router.route("/profile/:id").get(users.profile);

router.get("/logout", users.logout);

module.exports = router;
