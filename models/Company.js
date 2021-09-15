/* eslint-disable prettier/prettier */
const mongoose = require("./init");
const Payment = require("./Payments");

const CompanySchema = new mongoose.Schema({
  address: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique:true
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
  accountType: {
    type: String,
    required: true,
  },
  payments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Payment" }],
  phoneNumber: {
    type: String,
    default: "",
  },
});

module.exports = mongoose.model("Company", CompanySchema);
