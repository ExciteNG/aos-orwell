/* eslint-disable standard/object-curly-even-spacing */
/* eslint-disable prettier/prettier */
const mongoose = require('mongoose');
let emailRegexVal = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

const adbannerSchema = mongoose.Schema({
  categories: { type: String, required: true },
  purpose: { type: String, required: true },
  banner: { type: String, required: false },
  approval: { type: Boolean, default: false},
  dateApproved: { type: String },
  email: {type: String,  validate:{
    validator:function(v){
        return emailRegexVal.test(v)
    },
    message:mail => `${mail.value} is not a valid email address !`
},
required:[true,'Please enter your email address'] ,
unique: true}
},
{ timestamps: true });

module.exports = mongoose.model('AdBanner', adbannerSchema);
