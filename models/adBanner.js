/* eslint-disable standard/object-curly-even-spacing */
/* eslint-disable prettier/prettier */
const mongoose = require('./init');

const adbannerSchema = mongoose.Schema({
  categories: { type: String, required: true },
  purpose: { type: String, required: true },
  banner: { type: String, required: true },
  approval: { type: Boolean, default: false},
  dateApproved: { type: String , default:""},
  email: {type: String,required:true},
  storeInfo:{
    type:Object,
    required:true
  }
})
// { timestamps: true });

module.exports = mongoose.model('AdBanner', adbannerSchema);
