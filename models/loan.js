/* eslint-disable prettier/prettier */
const mongoose = require("./init");
let phoRegexVal = new RegExp("^\\+[0-9]+$");
let emailRegexVal = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

const loanSchema = mongoose.Schema({
  BVN: {
    type: String,
    default: "",
  },
  addressRes: {
    type: String,
    default: "",
  },
  annualRent: {
    type: String,
    default: "",
  },
  authPin: {
    type: String,
    default: "",
  },
  authPinHidden: {
    type: String,
    default: "",
  },
  cac: { type: String, default: "" },
  chequeNo: { type: String, default: "" },
  disbAcctName: { type: String, default: "" },
  disbAcctNo: { type: String, default: "" },
  disbAcctBank: { type: String, default: "" },
  bvnPhone: {
    type: String,
    default: "",
  },
  dob: {
    type: String,
    default: "",
  },
  email: {
    type:String,
   default:""
},
  officialEmail: {
    type: String,
    default: "",
  },
  employmentStatus: {
    type: String,
    default: "",
  },
  firstName: {
    type: String,
    default: "",
  },
  gender: {
    type: String,
    default: "",
  },
  identification: {
    type: String,
    default: "",
  },
  incomeBand: {
    type: String,
    default: "",
  },
  lgaOrigin: {
    type: String,
    default: "",
  },
  loanAmount: {
    type: String,
    default: "",
  },
  maritalStatus: {
    type: String,
    default: "",
  },
  memo: { type: String, default: "" },
  guarantorLetter: { type: String, default: "" },
  netIncome: { type: String, default: "" },

  prevAcctBank: { type: String, default: "" },
  prevAcctNo: { type: String, default: "" },
  prevAcctName: { type: String, default: "" },
  tenor: { type: String, default: "" },
  middleName: {
    type: String,
    default: "",
  },
  monthlyIncome: {
    type: String,
    default: "",
  },
  outstandingLoan: {
    type: String,
    default: "",
  },
  passport: {
    type: String,
    default: "",
  },
  phoneNumber: {
    type: String,
    default: "",
  },
  phoneNumberAlt: {
    type: String,
    default: "",
  },
  qualification: {
    type: String,
    default: "",
  },
  salaryPayDay: {
    type: String,
    default: "",
  },
  signature: {
    type: String,
    default: "",
  },
  stateOrigin: {
    type: String,
    default: "",
  },
  streetNumber: {
    type: String,
    default: "",
  },
  surname: {
    type: String,
    default: "",
  },
  SOA: {
    type: String,
    default: "",
  },

  utility: {
    type: String,
    default: "",
  },
  workAddress: {
    type: String,
    default: "",
  },
  workPlace: {
    type: String,
    default: "",
  },
  nextOfKin: {
    type: Array,
    default: [
      {
        surname: { type: String },
        middleName: { type: String },
        firstName: { type: String },
        relationship: { type: String },
        email: { type: String },
        phone: { type: String },
      },
    ],
  },
  fundingPartner: {
    type: String,
    default: "",
  },
});

module.exports = mongoose.model("loan", loanSchema);
