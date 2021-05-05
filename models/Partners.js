/* eslint-disable prettier/prettier */
const mongoose = require("./init");
const passportLocalMongoose = require("passport-local-mongoose");
let emailRegexVal = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;


const partnerSchema = new mongoose.Schema({
  email: {
    type: String,
    index: true,
    unique: true,
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
    default: { isApproved: "pending", dateApproved: "", dateRegistered: "" },
  },
  partnerCode:{
    type:String,
    default:""
  },
  accountDetails: {
    type:Object,
    default:  { bank: "", accountNo: "", branch: "",bvn:"",accountName:"",paymentMode:"" },
  },

  company:{
    type:Object,
    default:{name:"",address:"",rc:"",tin:"",nature:"",taxCert:"",cacCert:""}
  },
  earnings:{
    type:Array,
    default:[
      {
        amount:0,
        email:"",
        package:"",
        cycle:"",
        commission:0
      }
    ]
  }
});

const Partner = (module.exports = mongoose.model("Partner", partnerSchema));
