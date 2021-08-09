/* eslint-disable prettier/prettier */
const mongoose = require("./init");
const passportLocalMongoose = require("passport-local-mongoose");


const Agents = require("./Agents");


const agentReportSchema = new mongoose.Schema({
  sector: {
    type: Number,
    required:true
  },
  location:{
    type: String,
    default:""
  },
  report: {
    type: String,
    required: true,
  },
  date: {
    type: Number,
    default:Date.now(),
  },
  reporter: { type: mongoose.Schema.Types.ObjectId, ref: Agents },
});

module.exports = mongoose.model("AgentFeedback", agentReportSchema);
