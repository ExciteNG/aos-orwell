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
  subscriptionStart: {
    type: Number,
    default: 0,
  },
  subscriptionEnd: {
    type: Number,
    default: 0,
  },
  AryshareProfileKey: {
    type: String,
  },
  referral: {
    type: Object,
    default: { isReffered: false, refCode: "", count: 0 },
  },
  email: {
    type: String,
    unique: true,
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
  partnerCode: {
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

  company: {
    type: Object,
    default: {
      name: "",
      address: "",
      rc: "",
      tin: "",
      nature: "",
      taxCert: "",
      cacCert: "",
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
      },
    ],
  },
  cycle: {
    type: String,
    default: "",
  },
  refBy: { type: String, default: "" },
  netBalance: { type: Number, default: 0 },
  incomeTotal: { type: Number, default: 0 },
  expenseTotal: { type: Number, default: 0 },
  costOfSaleTotal: { type: Number, default: 0 },
  creditTotal: { type: Number, default: 0 },
  debitTotal: { type: Number, default: 0 },
  inventoryCost: { type: Number, default: 0 },
  product: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
  customers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Customer" }],
  transactions: [
    { type: mongoose.Schema.Types.ObjectId, ref: "PostTransaction" },
  ],
  ongoingCampaigns: { type: Number, default: 0 },
  completedCampaigns: { type: Number, default: 0 },
  pendingCampaigns: { type: Number, default: 0 },
  declinedCampaigns: { type: Number, default: 0 },
});

module.exports = mongoose.model("Profile", profileSchema);

// influencers: [{ type: mongoose.Schema.Types.ObjectId, ref: "influencer" }],
