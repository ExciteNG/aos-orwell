/* eslint-disable standard/object-curly-even-spacing */
/* eslint-disable prettier/prettier */
const mongoose = require('../init');

const transactionSchema = mongoose.Schema({
  merchant: { type: String, required:true },
  accountType: { type: String },
  description: { type: String, unique: true },
  inventoryCost: { type: Number},
  inventorytotal: { type: Number},
  total: { type: Number, default:0 },
  productSaleSum: { type: Number, default: 0},
  transactionsTotal:[{type:mongoose.Schema.Types.ObjectId,
    ref:"PostTransaction"}],
  storeInfo:{
    type:Object,
  }
},
{ timestamps: true })
module.exports = mongoose.model('Transaction', transactionSchema);
