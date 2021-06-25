const mongoose = require('./init');
let emailRegexVal = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

const AgreePriceSchema = mongoose.Schema({
    email:{
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
    userType:{
        type:String,
        default:"EX10AF"
    },
    price:{
        type:Number,
        default:0
    },
    createdAt:{
        type:String,
        default:new Date().toString()
    }
})

module.exports = mongoose.model('agreeprice', AgreePriceSchema)