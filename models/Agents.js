/* eslint-disable prettier/prettier */
const mongoose = require("./init");
const passportLocalMongoose = require("passport-local-mongoose");
let emailRegexVal = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
const Payout = require("./Payouts");
const Payment = require("./Payments");
const Profile = require("./Profiles");

const agentSchema = new mongoose.Schema({
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
  id: {
    type: Object,
    default: { id: "", passport: "", idType: "", signature: "" },
  },
  passport: {
    type: Object,
    default: {},
  },
  mobile: {
    type: String,
    default: "",
  },

  fullName: {
    type: String,
    default: "",
  },
  agentCode: {
    type: String,
    default: "",
  },
  address: {
    type: String,
    default: "",
  },
  agentCount: {
    type: Number,
    default: 0,
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
  nok: {
    type: String,
    default: "",
  },
  nokAddress: {
    type: String,
    default: "",
  },
  nokPhone: {
    type: String,
    default: "",
  },
  nokRelationship: {
    type: String,
    default: "",
  },
  approve: {
    type: Boolean,
    default: false,
  },
  sector: {
    type: Number,
    default: 0,
  },
  logins: {
    type: Array,
    default: []
  },
  isLead:{
    type:Boolean,
    default:false,
  },
  supervisedBy:{
    type:String,
    default:""
  },
  merchants: [{ type: mongoose.Schema.Types.ObjectId, ref: Profile }],
  earnings: [{ type: mongoose.Schema.Types.ObjectId, ref: Payment }],
  payouts: [{ type: mongoose.Schema.Types.ObjectId, ref: Payout }],
});

module.exports = mongoose.model("Agent", agentSchema);
