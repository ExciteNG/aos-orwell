/* eslint-disable prettier/prettier */
const mongoose = require("./init");
const passportLocalMongoose = require("passport-local-mongoose");
let emailRegexVal = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;


const payoutSchema = new mongoose.Schema({
  email: {
    type: String,
    required:true
  },
  userType: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    default: 0,
  },
  date:{
    type:Date,
    default:Date.now()
  }
});

module.exports = mongoose.model("Payout",payoutSchema);