const mongoose = require('./init')
let emailRegexVal = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;


const merchantInfluencerSchema = mongoose.Schema({
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
    productName:{
        type:String,
        required:true
    },
    ReasonForProm:{
        type:String,
        required:true
    },
    productQualities:{
        type:String,
        required:true
    },
    reach:{
        type:Number,
        required:true
    }

})


module.exports = mongoose.model('merchantInfluencer',merchantInfluencerSchema)