const { application } = require("express");
const express = require("express");
const router = express.Router();
const podcast = require("./../models/podcast");
var cloudinary = require("cloudinary").v2;
const Podcast = require("./../controller/podcastController");
const multer = require("multer");
const { storage } = require("./../cloudinary");
const upload = multer({ storage });

router.route("/").post(upload.single("image"), Podcast.newpodcast);

router.post("/newVideo", async (req, res) => {
  console.log("HIII");
  const storage = multer.diskStorage({
    filename: (req, file, cb) => {
      const fileExt = file.originalname.split(".").pop();
      const filename = `${new Date().getTime()}.${fileExt}`;
      cb(null, filename);
    },
  });

  const fileFilter = (req, file, cb) => {
    if (file.mimetype === "video/mp4") {
      cb(null, true);
    } else {
      cb(
        {
          message: "Unsupported File Format",
        },
        false
      );
    }
  };

  const upload = multer({
    storage,
    limits: {
      fieldNameSize: 200,
      fileSize: 30 * 1024 * 1024,
    },
  }).single("video");

  upload(req, res, (err) => {
    if (err) {
      return res.send(err);
    }

    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD,
      api_key: process.env.CLOUDINARY_KEY,
      api_secret: process.env.CLOUDINARY_SECRET,
    });
    const { path } = req.file;

    const fName = req.file.originalname.split(".")[0];
    cloudinary.uploader.upload(
      path,
      {
        resource_type: "video",
        public_id: `VideoUploads/${fName}`,
        chunk_size: 6000000,
      },
      async (err, video) => {
        if (err) return res.send(err);
        const VideoUrl = video.url;

        // const podcast = await Podcasts.findOne({
        //   title: req.body.title,
        // });
        const podcasts = await podcast.findOne({
          title: req.body.title,
        });
        console.log(podcasts);
        podcasts.VideoUrl = video.url;
        podcasts.save();
        console.log(podcasts);
        res.status(200).json({
          message: "Succesfully Done",
          statuscode: 200,
        });
      }
    );
  });
});
router.route("/podcast/:id").get(Podcast.getcurrentpodcast);
router.route("/getpodcasts").get(Podcast.getpodcasts);
router.route("/getaudio").get(Podcast.getaudio);
router.route("/getvideo").get(Podcast.getvideo);
router.route("/like/:id").get(Podcast.likepodcast);
router.route("/favouritepodcast").get(Podcast.favouritepodcast);
router.route("/searchbar").get(Podcast.search);
router.route("/categories/:name").get(Podcast.categories);

module.exports = router;
