const mongoose = require("./init");
const passportLocalMongoose = require("passport-local-mongoose");

const ProductSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  category: {
    type: Array,
    default: [],
  },
  subCategory: {
    type: String,
    required: true,
  },
  brand: { type: String, unique: false },
  condition: {
    type: String,
    default: "",
  },
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
    required:true
  },
  priority:{
    type:Number
  },
  storeInfo: {
    type: Object,
    required: true,
  },
});

const Product = (module.exports = mongoose.model("Product", ProductSchema));
