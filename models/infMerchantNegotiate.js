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
        type:Array,
        default:[]
    },
    influencerMessages:{
        type:Array,
        default:[]
    },
    startDateStr:{
        type:String,
        default:""
    },
    startDate:{
        type:Number,
        default:0
    },
    endDate:{
        type:Number,
        default:0
    }
})

module.exports = mongoose.model('Negotiate',NegotiateSchema)