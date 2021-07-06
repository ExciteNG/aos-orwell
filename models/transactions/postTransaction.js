/* eslint-disable standard/object-curly-even-spacing */
/* eslint-disable prettier/prettier */
const mongoose = require('../init');

const postTransactionSchema = mongoose.Schema({
  merchant: { type: String },
  account: { type: String },
  accountType: { type: String },
  postTransactionDescription: { type: String },
  selectedTitle: { type: String },
  amount: { type: String },
  paymentMode: { type: String },
  income: { type: Number },
  expense: { type: Number },
  costOfSale: { type: Number },
  credit: { type: Number },
  debit: { type: Number },
  incomeTotal: { type: Number },
  expenseTotal: { type: Number },
  costOfSaleTotal: { type: Number },
  creditTotal: { type: Number },
  debitTotal: { type: Number },
  storeInfo:{
    type:Object,
    // required:true
  }
},
{ timestamps: true })
module.exports = mongoose.model('PostTransaction', postTransactionSchema);
