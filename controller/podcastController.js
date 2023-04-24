const Podcast = require("./../models/podcast");
const User = require("./../models/user");

module.exports.newpodcast = (req, res) => {
  const json_data = req.body.data;
  console.log(req.file);
  const data = JSON.parse(json_data);
  try {
    data.UploadField.poster = {
      url: req.file.path,
      filename: req.file.filename,
    };
    const podcast = new Podcast(data.UploadField);
    podcast;
    podcast.save();
    res.status(200).json({
      message: "Successfully Updated",
      statuscode: 200,
    });
  } catch (e) {
    res.status(404).json({
      message: "Something went wrong",
      statuscode: 404,
    });
  }
};

module.exports.categories = async (req, res) => {
  const name = req.params.name;
  const data = await Podcast.find({ category: name });
  try {
    res.status(200).json({
      message: data,
      statuscode: 200,
    });
  } catch (e) {
    res.status(404).json({
      message: "Something went wrong",
      statuscode: 404,
    });
  }
};

module.exports.getpodcasts = async (req, res) => {
  const data = await Podcast.find({});
  try {
    res.status(200).json({
      message: data,
      statuscode: 200,
    });
  } catch (e) {
    res.status(404).json({
      message: "Something went wrong",
      statuscode: 404,
    });
  }
};

module.exports.getcurrentpodcast = async (req, res) => {
  const id = req.params.id;
  const data = await Podcast.findById(id);
  try {
    res.status(200).json({
      message: data,
      statuscode: 200,
    });
  } catch (e) {
    res.status(404).json({
      message: "Something went wrong",
      statuscode: 404,
    });
  }
};

module.exports.getvideo = async (req, res) => {
  const data = await Podcast.find({ type: "Video" });
  try {
    res.status(200).json({
      message: data,
      statuscode: 200,
    });
  } catch (e) {
    res.status(404).json({
      message: "Something went wrong",
      statuscode: 404,
    });
  }
};

module.exports.getaudio = async (req, res) => {
  const data = await Podcast.find({ type: "Audio" });
  try {
    res.status(200).json({
      message: data,
      statuscode: 200,
    });
  } catch (e) {
    res.status(404).json({
      message: "Something went wrong",
      statuscode: 404,
    });
  }
};

module.exports.favouritepodcast = async (req, res) => {
  console.log(req.session);
  const user = await User.findById(req.user._id).populate({
    path: "Favouritepodcast",
  });
  try {
    res.status(200).json({
      message: user,
      statuscode: 200,
    });
  } catch (e) {
    res.status(404).json({
      message: "Something went wrong",
      statuscode: 404,
    });
  }
};

module.exports.likepodcast = async (req, res) => {
  console.log("Hiii");
  const id = req.params.id;
  const podcast = await Podcast.findById(id);
  podcast.likes = +1;
  await podcast.save();
  console.log(podcast);
  console.log(req.user._id);
  const user = await User.findById(req.user._id);
  console.log(user);
  user.Favouritepodcast.push(id);
  await user.save();
  try {
    res.status(200).json({
      message: "Succesfully done ",
      statuscode: 200,
    });
  } catch (e) {
    res.status(404).json({
      message: "Something went wrong",
      statuscode: 404,
    });
  }
};

module.exports.search = async (req, res) => {
  const title = req.query.q;
  const podcast = await Podcast.find({ authorName: title });
  try {
    res.status(200).json({
      message: podcast,
      statuscode: 200,
    });
  } catch (e) {
    res.status(404).json({
      message: "Something went wrong",
      statuscode: 404,
    });
  }
};
