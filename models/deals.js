/* eslint-disable prettier/prettier */
const mongoose = require("./init");
let emailRegexVal = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
const Deals = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  subCategory: {
    type: String,
  },
  category: {
    type: String,
    required: true,
  },
  prevPrice: {
    type: Number,
    default: 0,
  },
  dealPrice: {
    type: Number,
    default: 0,
  },
  endDate: {
    type: Date,
    required: true,
    // default:new Date()
  },
  desc: {
    type: String,
    required: true,
  },
  approved: {
    type: Boolean,
    default: true,
  },
  dealImg: {
    type: String,
    required: true,
  },
  storeInfo: {
    type: Object,
    default: {},
  },
  discnt:{
    type: String,
    required: true,
  },
  email: {
    type:String,
    validate:{
        validator:function(v){
            return emailRegexVal.test(v)
        },
        message:mail => `${mail.value} is not a valid email address !`
    },
    required:[true,'Please enter your email address'],
    unique:true
}
});

module.exports = mongoose.model("Deal", Deals);
