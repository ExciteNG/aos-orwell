/* eslint-disable prettier/prettier */
const mongoose = require('mongoose');

const tax = mongoose.Schema({
  payer: { type: String, required: true },
  address: { type: String },
  businessNature: { type: String, required: true },
  rc: {type: String, required: true},
  type: {type: String, required: true},
  subType:{type: String, default:""},
  payerId: {type: String, required: true},
  from: {type: String, required: true},
  to: {type: String, required: true},
  amount: {type: String, required: true},
  details:{type:Object,required:true},
  isAssigned: {
    type: Boolean,
    default: false
  },
  assignedTo: {
    type: mongoose.Schema.ObjectId,
    ref: 'Partner'
  },
  category:{
    type: String, 
    required: true
  },
  email: {type: String, required: true},
  status:{
    type:"String",
    default:"Pending"
  }
},
{ timestamps: true });

module.exports = mongoose.model('Tax', tax);
