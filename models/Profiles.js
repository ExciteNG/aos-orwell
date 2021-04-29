/* eslint-disable prettier/prettier */
const mongoose = require("./init");
const passportLocalMongoose = require("passport-local-mongoose");
let emailRegexVal = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;


const profileSchema = new mongoose.Schema({
  storeInfo: {
    type: Object,
    default: {
      storeName: "",
      storeAddress: "",
      storePhone: "",
      storeLga: "",
      storeState: "",
    },
  },
  subscriptionLevel: {
    type: Number,
    default: 0,
  },
  subscriptionStart:{
    type:String,
  },
  subscriptionEnd:{
    type:String,
  },
  AryshareProfileKey:{
    type:String,
  },
  referral: {
    type: Object,
    default: { isReffered: false, refCode: "",count:0 },
  },
  email: {
    type: String,
    required:true
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
  partnerCode:{
    type:String,
    default:""
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

const Profile = (module.exports = mongoose.model("Profile", profileSchema));
