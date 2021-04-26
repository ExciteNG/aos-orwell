/* eslint-disable prettier/prettier */
const mongoose = require('mongoose');

const tax = mongoose.Schema({
  payer: { type: String, required: true },
  address: { type: String },
  businessNatue: { type: String, required: true },
  rcNumber: {type: Number, required: true},
  taxType: {type: String, required: true},
  payerId: {type: String, required: true},
  fromDate: {type: String, required: true},
  toDate: {type: String, required: true},
  amount: {type: String, required: true},
  // email: {type: String, required: true}
},
{ timestamps: true });

module.exports = mongoose.model('Tax', tax);
