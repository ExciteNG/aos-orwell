const mongoose = require("./init");
const passportLocalMongoose = require("passport-local-mongoose");

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
  email:{type:String, unique:false},
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