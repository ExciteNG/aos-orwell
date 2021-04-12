const mongoose = require('./init')
const passportLocalMongoose = require('passport-local-mongoose')

const userSchema = new mongoose.Schema({
 name:{type:String},
  email: { type: String, index: true, unique:true },
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
  }
})

userSchema.plugin(passportLocalMongoose, {
  usernameField: 'email',
  usernameLowerCase: true,
  session: false
})

const User = (module.exports = mongoose.model('User', userSchema))
