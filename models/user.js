const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const Schema = mongoose.Schema;

const UserSchema = Schema({
  googleId: String,
  name: String,
  email: {
    type: String,
  },
  Image: String,
  Usertype: {
    type: String,
    enum: ["User", "Admin"],
    default: "User",
  },
  picture: String,
  Favouritepodcast: [
    {
      type: Schema.Types.ObjectId,
      ref: "Video",
    },
  ],
  dob: Date,
  gender: String,
});
UserSchema.plugin(passportLocalMongoose);
module.exports = User = mongoose.model("User", UserSchema);
