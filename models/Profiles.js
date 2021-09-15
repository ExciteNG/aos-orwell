/* eslint-disable prettier/prettier */
const mongoose = require("./init");
// const passportLocalMongoose = require("passport-local-mongoose");
let emailRegexVal = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

const profileSchema = new mongoose.Schema({
  address: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  subscriptionLevel: {
    type: Number,
    default: 0,
  },
  subscriptionStart: {
    type: Number,
    default: 0,
  },
  subscriptionEnd: {
    type: Number,
    default: 0,
  },
  email: {
    type: String,
    unique: true,
    validate: {
      validator: function(v) {
        return emailRegexVal.test(v);
      },
      message: (mail) => `${mail.value} is not a valid email address !`,
    },
    required: [true, "Please enter your email address"],
  },
  userType: {
    type: String,
    required: true,
  },
  emailVerified: {
    type: Boolean,
    default: false,
  },
  identification: {
    type: Object,
    default: { id: "", passport: "", idType: "", signature: "" },
  },
  phone: {
    type: String,
    default: "",
  },
});

module.exports = mongoose.model("Profile", profileSchema);
