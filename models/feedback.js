/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
const mongoose = require('./init');

const feedbackModel = new mongoose.Schema({
    name:{
        type:String,
    },
    email:{
        type:String,
        required:[true,'please enter your email address']
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