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
    userType:{
        type:String
    },
    productName:{
        type:String,
        required:true
    },
    ReasonForProm:{
        type:String,
        required:true
    },
    uniqueQualities:{
        type:String,
        required:true
    },
    permanentPosts:{
        type:String
    },
    contactPreference:{
        type:String,
        default:""
    },
    modeOfContact:{
        type:Array,
        default:[]
    },
    mediaPlacement:{
        type:Array,
        default:[]
    },
    influencerLevel:{
        type:String,
        required:true
    },
    productUsers:{
        type:Array,
        default:[]
    },
    reach:{
        type:Number,
        required:true
    },
    productPrice:{
        type:String,
        required:true
    },
    competitors:{
        type:Array,
        default:[]
    },
    productServiceCategory:{
        type:Array, 
        default:[]
    },
    contentCreator:{
        type:String,
        required:true
    },
    noOfPosts:{
        type:String,
        required:true
    },
    durationOfPromotion:{
        type:String,
        required:true
    },
    crossPlatformPromotion:{
        type:String
    },
    deliverable:{
        type:String,
        default:""
    },
    deliveryType:{
        type:Array,
        default:[]
    },
     coverage:{
        type:Array,
        default:[]
    },
    pricing:{
        type:Array,
        default:[]
    }

})


module.exports = mongoose.model('merchantInfluencer',merchantInfluencerSchema)