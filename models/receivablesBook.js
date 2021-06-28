/* eslint-disable prettier/prettier */
const mongoose = require('./init')
let emailRegexVal = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

const receivablesModel = mongoose.Schema({
  productName: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true
  },
  inventoryPrice: {
    type: Number
  },
  quantity: {
    type: Number,
    default: 1
  },
  cost: {
    type: Number,
    default: 0
  },
  total: {
    type: Number
  },
  inventoryTotal: {
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
  buyersEmail: {
    type: String,
    validate:{
      validator:function(v){
          return emailRegexVal.test(v)
      },
      message:mail => `${mail.value} is not a valid email address !`
  },
  // required:[true,'Please enter your email address']
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

  // buyersEmail:{
  //     type:String,
  //     validate:{
  //       validator:function(v){
  //           return emailRegexVal.test(v)
  //       },
  //       message:mail => `${mail.value} is not a valid email address !`
  //   },
  //   // required:[true,'Please enter your email address']
  // },

  typeOfLedger: {
    type: String,
    default: "sales"
  },
  salesTarget: {
    type: Number
  },
  storeInfo:{
    type:Object,
  },
  salesRef:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"bookrecord"
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
},
{ timestamps: true });

module.exports = mongoose.model('ReceivablesRecord', receivablesModel);
