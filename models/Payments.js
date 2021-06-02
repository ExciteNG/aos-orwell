/* eslint-disable prettier/prettier */
const mongoose = require("./init");
let emailRegexVal = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

const PaymentSchema = new mongoose.Schema({
  email: {
    type:String,
    validate:{
        validator:function(v){
            return emailRegexVal.test(v)
        },
        message:mail => `${mail.value} is not a valid email address !`
    },
    required:[true,'Please enter your email address'],
    unique:true
},
  ref: {
    type: Object,
    required:true
  },
  amount:{
    type: String,
    default: "",
  },
  service:{
    type: String,
    required:true,
  },
  package:{
    type: String,
    required:true,
  },
  cycle:{
    type: String,
    required:true,
  }
});


const Payment = (module.exports = mongoose.model("Payment", PaymentSchema));


