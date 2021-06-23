/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
const mongoose = require('./init');
let emailRegexVal = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

const feedbackModel = new mongoose.Schema({
    name:{
        type:String,
    },
    email: {
        type:String,
        validate:{
            validator:function(v){
                return emailRegexVal.test(v)
            },
            message:mail => `${mail.value} is not a valid email address !`
        },
        required:[true,'Please enter your email address'],
        unique:true
    },
    message:{
        type:String,
        default:""
    },
    mode:{
        type:String,
        default:['newsletter','enquiries']
    }
})

module.exports = mongoose.model('feedback',feedbackModel)