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
const MongoStore = require("connect-mongo");
const cookieParser = require("cookie-parser");
const User = require("./models/user");
const cookieSession = require("cookie-session");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
require("./auth/passport");

const secret = "thisshouldbeabettersecret";

const store = new MongoStore({
  mongoUrl: url,
  secret,
  touchAfter: 24 * 60 * 60,
});

store.on("error", function (e) {
  console.log("Session Store Error", e);
});

const sessionConfig = {
  store,
  secret,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    secure: false,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};
app.use(cookieParser("thisshouldbeabettersecret"));

app.use(expressSession(sessionConfig));

app.use(passport.initialize());
app.use(passport.session());
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: "GET,PUT,POST,DELETE",
    optionsSuccessStatus: 200,
    credentials: true,
  })
);
passport.use(new localpassport(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

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
