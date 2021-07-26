/* eslint-disable prettier/prettier */
const mongoose = require("./init");
const passportLocalMongoose = require("passport-local-mongoose");
let emailRegexVal = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;


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
  merchants: [{ type: mongoose.Schema.Types.ObjectId, ref: "Profile" }],
});

const Agent = (module.exports = mongoose.model(
  "Agent",
  agentSchema
));