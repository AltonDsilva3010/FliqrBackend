const express = require("express");
require("dotenv").config();
const app = express();
const mongoose = require("mongoose");
const url = process.env.DB_URL_ATLAS;
const cors = require("cors");
const passport = require("passport");
const expressSession = require("express-session");
const UserRoute = require("./route/userRoute");
const userRoute = require("./route/userformRoute");
const PodcastRoute = require("./route/padcastRoute");
const localpassport = require("passport-local");
const User = require("./models/user");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
require("./auth/passport");
app.use(
  expressSession({
    name: "session",
    secret: ["shreyaskeni"],
    maxAge: 24 * 60 * 60 * 100,
  })
);
app.use(cors());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localpassport(User.authenticate()));

mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
  console.log("Database Connected");
});

app.get("/", (req, res) => {
  res.send("Hiiii");
});

app.use("/", userRoute);
app.use("/npodcast", PodcastRoute);
app.use("/api/v1", UserRoute);

app.listen(3000, (req, res) => {
  console.log("Listening to Server");
});
