/* eslint-disable prettier/prettier */
const mongoose = require("./init");
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
  email:{
    type: String,
    required: true,
  }
});

module.exports = mongoose.model("Deal", Deals);
