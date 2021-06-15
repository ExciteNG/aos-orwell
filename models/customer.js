/* eslint-disable standard/object-curly-even-spacing */
/* eslint-disable prettier/prettier */
const mongoose = require('./init');
let emailRegexVal = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

const customerSchema = mongoose.Schema({
  customerName: { type: String, required: true },
  buyersEmail:{
    type:String,
    index: { unique: true, sparse: true },  // allow duplicate null values
    validate:{
      validator:function(v) {
        return emailRegexVal.test(v)
      },
    message:mail => `${mail.value} is not a valid email address !`
    },
    required:[true,'Please enter your email address']
  },
  phone: { type: String, index: { unique: true, sparse: true }},
  address: { type: String},
  buyersContact: { type: String},
  storeInfo:{
    type:Object,
    // required:true
  }
},
{ timestamps: true })
module.exports = mongoose.model('Customer', customerSchema);
