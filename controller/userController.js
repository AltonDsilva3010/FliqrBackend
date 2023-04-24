const User = require("./../models/user");

module.exports.register = async (req, res, next) => {
  try {
    const { email, username, password } = req.body;
    const user = new User({ email, username });
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, (err) => {
      if (err) return next(err);
      res.status(200).json({
        statuscode: 200,
        message: "Successfully Logged in",
      });
    });
  } catch (e) {
    console.log(e);
    res.status(404).json({
      statuscode: 404,
      message: "Something went wrong",
    });
  }
};

module.exports.login = (req, res) => {
  try {
    console.log("Hello Inside Login controller");
    res.status(200).json({
      user: req.user,
      statuscode: 200,
    });
  } catch (e) {
    res.status(404).json({
      message: "Something went wrong",
      statuscode: 404,
    });
  }
};

module.exports.profile = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id);
    console.log(id);
    console.log(user);
    res.status(200).json({
      user: user,
      statuscode: 200,
    });
  } catch (e) {
    res.status(404).json({
      message: "Something went wrong",
      statuscode: 404,
    });
  }
};

module.exports.logout = (req, res) => {
  req.logout(function (err) {
    if (err) {
      console.log(err);
    }
    console.log("Logging Out");
    res.status(200).json({
      statuscode: 200,
      message: "Successfully Logged Off",
    });
  });
};
