/* eslint-disable standard/object-curly-even-spacing */
/* eslint-disable prettier/prettier */
const mongoose = require('mongoose');

const adbannerSchema = mongoose.Schema({
  categories: { type: String, required: true },
  purpose: { type: String, required: true },
  banner: { type: String, required: false },
  approval: { type: Boolean, default: false},
  dateApproved: { type: String }
},
{ timestamps: true });

module.exports = mongoose.model('AdBanner', adbannerSchema);
