/* eslint-disable standard/object-curly-even-spacing */
/* eslint-disable prettier/prettier */
const mongoose = require('./init');
let emailRegexVal = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

const balanceSchema = mongoose.Schema({
  merchant: { type: String },
  typeOFBalance: { type: String },
  account: { type: String },
  categoryOfBalance: { type: String },
  amount: {type: Number},
  description: { type: String},
  debit: { type: Number },
  credit: { type: Number },
  recordBalance: {type: Number, default:0 },
  customerEmail:{
    type:String,
    // index: { unique: true, sparse: true },  // allow duplicate null values
    validate:{
      validator:function(v) {
        return emailRegexVal.test(v)
      },
    message:mail => `${mail.value} is not a valid email address !`
    },
    required:[true,'Please enter customer email address']
  },

  storeInfo:{
    type:Object,
    // required:true
  }
},
{ timestamps: true })
module.exports = mongoose.model('Balance', balanceSchema);
