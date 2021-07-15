/* eslint-disable prettier/prettier */

const mongoose = require('./init');
let emailRegexVal = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

const influencerSChema = mongoose.Schema({
    fullName:{
        type:String,
        required:[true,'please enter your full name !']
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
        unique:true,
        lowercase:true
    },
    userType:{
        type:String,
        default:"EX90IF",
        required:true
    },
    emailVerified: {
        type: Boolean,
        default: false,
      },
    mobile:{
        type:String,
        required:[true,'Please enter your phone number']
    },
    stateOfResidence:{
        type:String,
        required:[true,'please enter address !']
    },
    socialMediaPlatform:{
        type:Array,
        default:[],
    },
    socialMediaHandles:{
        type:Object,
        default:{facebook:"",instagram:"",youtube:""}
    },
    noOfFollowers:{
        type:Object,
        default:{facebook:[],instagram:[],youtube:[]}
    },
    influencerLevel:{
        type:String,
        // default:{Micro:"10000-50000", Mini:"50000-500000", Maxi:">500000"}
    },
    amountPerPost:{
        type:Number,
        required:true
    },
    AccountNo:{
        type:String,
        default:""
    },
    Bank:{
        type:String,
        default:""
    },
    // telephone:{
    //     type:String
    // },
    country:{
        type:String,
        required:true
    },
    coverage:{
        type:Array,
        default:[]
    },
    marketingSpecialty:{
        type:String,
        default:""
    },
    negotiable:{
        type:String,
        required:true
    },
    profilePhoto:{
        type:String
    },
    regStatus: {
        type: String,
        default:"pending",
      },
      dateApproved:{
          type:String,
          default:""
      },
      pendingJobs:{
          type:Number,
          default:0
      },
      completedJobs:{
          type:Number,
          default:0
      },
      currentJobs:{
          type:Number,
          default:0
      },
      exciteClients:[{
          type:mongoose.Schema.Types.ObjectId,
          ref:"Profile"
      }]
},
{timestamps:true})

module.exports = mongoose.model('influencer',influencerSChema)