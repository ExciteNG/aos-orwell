/* eslint-disable prettier/prettier */
const mongoose = require("./init");
const passportLocalMongoose = require("passport-local-mongoose");
//email regex validation
let emailRegexVal = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  accountType: {
    type: String,
    required: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  verifyToken: {
    type: String,
    default: "",
  },
  authToken: {
    type: String,
    default: "",
  },
  resetPasswordToken: String,
  resetPasswordExpires: {
    type: Number,
    default: Date.now(),
  },
});

userSchema.plugin(passportLocalMongoose, {
  usernameField: "email",
  usernameLowerCase: true,
  session: false,
});

const User = (module.exports = mongoose.model("User", userSchema));
