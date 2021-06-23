/* eslint-disable prettier/prettier */
const mongoose = require("./init");
const passportLocalMongoose = require("passport-local-mongoose");
let emailRegexVal = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

const TaskSchema = new mongoose.Schema({
  title: {
    type: String,
    required:true
  },
  teams: {
    type: Array,
    default: [],
  },
  ends:{
    type: String,
    required: true,
  },
  email:{type:String,
    validate:{
      validator:function(v){
          return emailRegexVal.test(v)
      },
      message:mail => `${mail.value} is not a valid email address !`
  },
  required:[true,'Please enter your email address'] , unique:false},
  commence: {
    type: String,
    required:true
  },
  description: {
    type: String,
    default: "",
  },
  name: {
    type: String,
    required:true,
  },
  assignedBy:{
    type: String,
    required:true,
  },
  supervisedBy:{
    type: String,
    required:true,
  }
});


const Task = (module.exports = mongoose.model("Task", TaskSchema));


// supervisedBy: {
//     type: String,
//     default: "",
//   },