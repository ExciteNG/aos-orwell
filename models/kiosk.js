/* eslint-disable standard/object-curly-even-spacing */
/* eslint-disable prettier/prettier */
const mongoose = require('./init');
let emailRegexVal = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

const kioskSchema = mongoose.Schema({
    fullName:{
        type:String,
        required:true
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
    phoneNumber:{
        type:String,
        required:true
    },
    kioskAddress:{
        type:String,
        required:true
    },
    lga:{
        type:String,
        required:true
    },
    state:{
        type:String,
        required:true
    },
    businessDesc:{
        type:String
    },
    kioskType:{
        type:String,
        required:true
    },
    price:{
        type:String,
        required:true
    },
    amountPaid:{
        type:Number,
        default:0
    },
    paymentType:{
        type:String,
        required:true
    },
    status:{
        type:String,
        default:"Pending"
    },
    reference:{
        type:Object,
    }
})

module.exports = mongoose.model('kiosk',kioskSchema);

//todo

//create  a crud and adminuuu0 x 