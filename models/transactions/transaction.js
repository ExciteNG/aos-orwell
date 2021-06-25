/* eslint-disable standard/object-curly-even-spacing */
/* eslint-disable prettier/prettier */
const mongoose = require('../init');

const transactionSchema = mongoose.Schema({
  merchant: { type: String, required:true },
  accountType: { type: String },
  description: { type: String, unique: true },
  total: { type: Number, default:0 },
  transactionsTotal:[{type:mongoose.Schema.Types.ObjectId,
    ref:"PostTransaction"}],
  // income: { type: Number },
  // expense: { type: Number },
  // costOfSale: { type: Number },
  // credit: { type: Number },
  // debit: { type: Number },
  storeInfo:{
    type:Object,
    // required:true
  }
},
{ timestamps: true })
module.exports = mongoose.model('Transaction', transactionSchema);
