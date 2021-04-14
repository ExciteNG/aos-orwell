const mongoose = require('mongoose');

const adbannerSchema = mongoose.Schema({
  categories: { type: String, required: true },
  purpose: { type: String, required: true },
  banner: { type: String, required: false },
  approval: { type: Boolean, default: false},
  dateApproved: { type: String },
  dateCreated: { type: Date, default: Date.now },
  dateUpdated: { type: Date, default: Date.now }
});

module.exports = mongoose.model('AdBanner', adbannerSchema);
