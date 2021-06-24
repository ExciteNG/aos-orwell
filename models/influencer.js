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
        default:"EX901F",
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
    StateOfResidence:{
        type:String,
        required:[true,'please enter address !']
    },
    socialmediaplatform:{
        type:Array,
        default:[],
    },
    socialmediahandles:{
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
    AmountPerPost:{
        type:Number,
        required:true
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
        type:Array,
        default:[]
    },
    Negotiable:{
        type:String,
        required:true
    },
    profilePhoto:{
        type:String
    },
    exciteClients:{
        type:Array,
        default:[{
            fullname:"",
            phone:"",
            storeInfo:{}
        }]
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
},
{timestamps:true})

module.exports = mongoose.model('influencer',influencerSChema)