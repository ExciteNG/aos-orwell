/* eslint-disable prettier/prettier */
const mongoose = require("./init");
const passportLocalMongoose = require("passport-local-mongoose");
let emailRegexVal = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

const ProductSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    default: '',
  },
  subCategory: {
    type: String,
    required: true,
  },
  gender:{
    type: String,
    default: ""
  },
  brand: { type: String, unique: false },
  condition: {
    type: String,
    default: "",
  },
  price:{type:String},
  description: {
    type: String,
    default: "",
  },
  color: {
    type: String,
  },
  size: {
    type: String,
    default: "",
  },
  imgUrl: {
    type: String,
    default: "",
  },
  year: {
    type: String,
    default: "",
  },
  email: {
    type: String,
    validate:{
      validator:function(v){
          return emailRegexVal.test(v)
      },
      message:mail => `${mail.value} is not a valid email address !`
  },
  required:[true,'Please enter your email address'] 
  },
  priority:{
    type:Number
  },
  room:{
    type: String,
  },
  transmission:{
    type: String,
  },
  fuelType:{
    type: String,
  },
  storeInfo: {
    type: Object,
    required: true,
  },
});

const Product = (module.exports = mongoose.model("Product", ProductSchema));
