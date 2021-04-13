const mongoose = require("./init");
const passportLocalMongoose = require("passport-local-mongoose");

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
  referral: {
    type: Object,
    default: { isReffered: false, refCode: "" },
  },
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
    default: { isApproved: false, dateApproved: "", dateRegistered: "" },
  },
  affiliateCode: {
    type: String,
    default: "",
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
    default:  { bank: "", accountNo: "", branch: "",bvn:"" },
  },

  company:{
    type:Object,
    default:{name:"",address:"",rc:"",tin:"",nature:"",taxCert:"",cacCert:""}
  }
});

const Profile = (module.exports = mongoose.model("Profile", profileSchema));
