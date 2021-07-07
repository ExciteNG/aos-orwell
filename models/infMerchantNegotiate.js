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
    influencerFullName:{
        type:String,
        default:""
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
    merchantFullName:{
        type:String,
        default:""
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
    },
    negotiationStatus:{
        type:String,
        default:"pending"
    }
})

module.exports = mongoose.model('Negotiate',NegotiateSchema)