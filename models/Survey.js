/* eslint-disable prettier/prettier */
const mongoose = require("./init");


const SurveySchema = new mongoose.Schema({
  Company: {
    type: String,
    required: true,
  },
  Date: {
    type: Date,
    required: true,
  },
  Name: {
    type: String,
    required: true,
  },
  PRS: {
    type: String,
    required: true,
  },
  SRR: {
    type: Array,
    required: true,
  },
  Score: {
    type: Number,
    required: true,
  },
  Suggestion: {
    type: String,
    default: 0,
  },
  Responses: {
    type: Array,
    required: true,
  },
});

module.exports = mongoose.model("Survey", SurveySchema);
