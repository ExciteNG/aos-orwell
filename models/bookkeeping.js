/* eslint-disable prettier/prettier */
const mongoose = require('./init')

const bookModel = new mongoose.Schema({
  productName: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true
  },
  buyersContact: {
    type: String
  },
  timePurchased: {
    type: Date,
    default: new Date()
  },
  description: {
    type: String
  },
  email:{
      type:String
  }
})

const bookrecords = (module.exports = mongoose.model('bookrecord', bookModel))
