/* eslint-disable prettier/prettier */
const Company = require("./Company");
const mongoose = require("./init");
// const passportLocalMongoose = require("passport-local-mongoose");
let emailRegexVal = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

const PaymentSchema = new mongoose.Schema({
  paymentType: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  package: {
    type: Number,
    default: 0,
  },
  amountPaid: {
    type: Number,
    default: 0,
  },
  company: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },

});

module.exports = mongoose.model("Payment", PaymentSchema);
