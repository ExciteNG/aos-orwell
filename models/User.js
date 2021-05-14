/* eslint-disable prettier/prettier */
const mongoose = require('./init')
const passportLocalMongoose = require('passport-local-mongoose')
let emailRegexVal = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;


const userSchema = new mongoose.Schema({
 name:{type:String, default:""},
  email: { type: String, index: true,
   unique:true },
  userType:{
    type:String,
    required:true
  },
  emailVerified:{
    type:Boolean,
    default:false
  },
  verifyToken:{
    type:String,
    default:""
  },
  authToken:{
    type:String,
    default:""
  },
  resetPasswordToken: String,
  resetPasswordExpires:{
    type:Number,
    default:Date.now()
  }
})

userSchema.plugin(passportLocalMongoose, {
  usernameField: 'email',
  usernameLowerCase: true,
  session: false
})

const User = (module.exports = mongoose.model('User', userSchema))
