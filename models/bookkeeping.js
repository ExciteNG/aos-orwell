/* eslint-disable prettier/prettier */
const mongoose = require('./init')
let emailRegexVal = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

const bookModel = new mongoose.Schema({
  productName: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true
  },
  salePrice: {
    type: Number
  },
  quantity: {
    type: Number
  },
  cost: {
    type: Number,
    default: 0
  },
  total: {
    type: Number
  },
  buyersContact: {
    type: String
  },
  timePurchased: {
    type: Date,
    default: new Date()
  },
  description: {
    type: String
  },
  qtySold: {
    type: Number,
    default: 0
  },
  totalPaid: {
    type: Number,
    default: 0
  },
  sumTotalPaid: {
    type: Number,
    default: 0
  },
  email:{
      type:String,
      validate:{
        validator:function(v){
            return emailRegexVal.test(v)
        },
        message:mail => `${mail.value} is not a valid email address !`
    },
    required:[true,'Please enter your email address']
  },
  typeOfLedger: {
    type: String,
    default: "Income"
  },
  salesTarget: {
    type: Number
  },
  storeInfo:{
    type:Object,
  }
})

const bookrecords = (module.exports = mongoose.model('bookrecord', bookModel))