/* eslint-disable no-useless-escape */
/* eslint-disable prettier/prettier */
const mongoose = require('./init');
let phoRegexVal = new RegExp('^\\+\[0-9]+$');
let emailRegexVal = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

const kycDir = mongoose.Schema({

    Surname:{
        type:String,
        required:true
    },
    OtherNames:{
        type:String,

    },
    Age:{
        type:Number
    },
    Nationality:{
        type:String,
        required:true
    },
    ResidentialAddress:{
        type:String
    },
    City:{
        type:String,
        required:true
    },
    State:{
        type:String,
        required:true
    },
    PoBox:{
        type:String
    },

    Email:{
        type:String,
        validate:{
            validator:function(v){

                return emailRegexVal.test(v)
            },
            message:mail => `${mail.value} is not a valid emmail address !`
        },
        required:[true,'Please enter your email address']
    },
    TelephoneNo:{
        type:String,
        validate:{
            validator:function(v){
                return phoRegexVal.test(v)
            },
            message: props => `${props.value} is not a valid phone number!, please enter your phonee number with a country code with no spaces`
        },
        required: [true, 'phone number required']
    }


})

module.exports = mongoose.model('kycDirectors',kycDir)