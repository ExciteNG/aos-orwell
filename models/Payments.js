/* eslint-disable prettier/prettier */
const mongoose = require("./init");

const PaymentSchema = new mongoose.Schema({
  email:{type:String, unique:false},
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


