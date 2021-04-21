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
        enum : ['Male','Female'],
        default: 'Male'
    },
    DateOfBirth:{
        type:Date,
        required:true
    },
    phoneNumber:{
        type:String,
        validate:{
            validator:function(v){
                return phoRegexVal.test(v)
            },
            message: props => `${props.value} is not a valid phone number!, please enter your phonee number with a country code with no spaces`
        },
        required: [true, 'phone number required']
    },
    emailAddress:{
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
        required:true
    },
    idNumber:{
        type:String,
        required:true
    },
    imageId:{
        type:String,
        required:true
    },
    passportImg:{
        type:String
    },
    signature:{
        type:String
    },
});

module.exports = mongoose.model('businessRegSchema',businessRegistrationSchema);