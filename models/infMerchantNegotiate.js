const mongoose = require('./init');
let emailRegexVal = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

const NegotiateSchema = mongoose.Schema({
    influencerEmail:{
        type:String,
        validate:{
            validator:function(v){
                return emailRegexVal.test(v)
            },
            message:mail => `${mail.value} is not a valid email address !`
        },
        required:[true,'Please enter your email address'],
        lowercase:true
    },
    merchantEmail:{
        type:String,
        validate:{
            validator:function(v){
                return emailRegexVal.test(v)
            },
            message:mail => `${mail.value} is not a valid email address !`
        },
        required:[true,'Please enter your email address'],
        lowercase:true
    },
    merchantMessages:{
        type:String,
        default:""
    },
    influencerMessages:{
        type:String,
        default:""
    },
    startDateStr:{
        type:String,
        default:""
    },
    startDate:{
        type:Date,
        default:0
    },
    endDate:{
        type:Number,
        default:0
    }
})

module.exports = monngoose.model('Negotiate',NegotiateSchema)