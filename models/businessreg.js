/* eslint-disable no-useless-escape */
/* eslint-disable prettier/prettier */
const mongoose = require('./init');
let phoRegexVal = new RegExp('^\\+\[0-9]+$');
// (\d{3})\D*(\d{3})\D*(\d{4})\D*(\d*)$/
// (?:\d{3}|\(\d{3}\))([-\/\.])\d{3}\1\d{4}
let emailRegexVal = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

const businessRegistrationSchema =  new mongoose.Schema({
    businessName:{
        type:String,
        required:true,
        unique:true
    },
    businessRegType:{
        type:String,
        required:true

    },
    businessDescription:{
        type:String,
        required:true,
        unique:true
    },
    businessAddress:{
        type:String,
        required:true
    },
    businessCity:{
        type:String,
        required:true
    },
    businessState:{
        type:String,
        required:true
    },
    businessLGA:{
        type:String
    },
    branchAddress:{
        type:String
    },
    branchCity:{
        type:String
    },
    branchState:{
        type:String
    },
    branchLGA:{
        type:String
    },
    surname:{
        type:String,
        required:true
    },
    firstName:{
        type:String,
        required:true
    },
    otherName:{
        type:String
    },
    formalName:{
        type:String
    },
    gender: {
        type: String,
        enum : ['male','female'],
        default: 'male'
    },
    dob:{
        type:Date,
        required:true
    },
    phoneNumber:{
        type:String,
        required: [true, 'phone number required']
    },
    email:{
        type:String,
        validate:{
            validator:function(v){
                return emailRegexVal.test(v)
            },
            message:mail => `${mail.value} is not a valid email address !`
        },
        required:[true,'Please enter your email address']
    },
    ownerAddress:{
        type:String
    },
    ownerCity:{
        type:String
    },
    ownerLGA:{
        type:String,
    },
    ownerState:{
        type:String
    },
    nationality:{
        type:String
    },
    formalNationality:{
        type:String
    },
    occupation:{
        type:String
    },
    idType:{
        type:String,
    },
    idNumber:{
        type:String,

    },
    idImg:{
        type:String,
    },
    passportImg:{
        type:String
    },
    signature:{
        type:String
    },
    status:{
        type:String,
        default:"Pending"
    },
    assignedTo: {
        type: mongoose.Schema.ObjectId,
        ref: 'Partner'
      },
      isAssigned:{
          type:Boolean,
          default:false
      }
});

module.exports = mongoose.model('businessRegSchema',businessRegistrationSchema);