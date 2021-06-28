/* eslint-disable prettier/prettier */
const mongoose = require("./init");
const passportLocalMongoose = require("passport-local-mongoose");
let emailRegexVal = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

const affiliateSchema = new mongoose.Schema({
  email: {
    type: String,
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

  fullname: {
    type: String,
    default: "",
  },
  location: Object,
  default: {
    address: "",
    lga: "",
    state: "",
    town: "",
  },
  regStatus: {
    type: Object,
    default: { isApproved: false, dateApproved: "", dateRegistered: "" },
  },
  affiliateCode: {
    type: String,
    default: "",
  },
  affiliateCount: {
    type: Number,
    default: 0,
  },
  broughtBy: {
    type: String,
    default: "",
  },
  cellInfo: {
    type: Object,
    default: {
      cell: "",
      cellGroup: "",
      isCellHead: false,
      isClusterHead: false,
      cluster: "",
    },
  },
  accountDetails: {
    type: Object,
    default: {
      bank: "",
      accountNo: "",
      branch: "",
      bvn: "",
      accountName: "",
      paymentMode: "",
    },
  },
  earnings: {
    type: Array,
    default: [
      {
        amount: 0,
        email: "",
        package: "",
        cycle: "",
        commission: 0,
        merchant: "",
      },
    ],
  },
  cycle: {
    type: String,
    default: "",
  },
  merchants: [{ type: mongoose.Schema.Types.ObjectId, ref: "Profile" }],
});

const Affiliate = (module.exports = mongoose.model(
  "Affiliate",
  affiliateSchema
));
