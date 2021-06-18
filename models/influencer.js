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
        required:true
    },
    Address:{
        type:String,
        required:[true,'please enter address !']
    },
    mobile:{
        type:String,
        required:[true,'Please enter your phone number']
    },
    telephone:{
        type:String
    },
    country:{
        type:String,
        required:true
    },
    StateOfResidence:{
        type:String,
        required:true
    },
    influencerCategory:{
        type:Object,
        default:{Micro:"10000-50000", Mini:"50000-500000", Maxi:">500000"}
    },
    website:{
        type:String
    },
    AverageDailyVisitors:{
        type:Number
    },
    socialmediaplatform:{
        type:Array,
        default:[],
    },
    socialmediahandlesFollowers:{
        type:Object,
        default:{twitter:"",instagram:"",youtube:""}
    },
    noOfFollowers:{
        type:Array,
        default:[]
    },
    marketingSpecialty:{
        type:Array,
        default:[]
    },
    AmountPerPost:{
        type:Number,
        required:true
    },
    AbletoDiscount:{
        type:String,
        required:true
    },
    profilePhoto:{
        type:String
    },
    exciteClients:{
        type:Array,
        default:[{
            storeInfo:{},
            fullname:"",
            phone:""
        }]
    },
    regStatus: {
        type: Object,
        default: { isApproved: "pending", dateApproved: "", dateRegistered: "" },
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
      }
})

module.exports = mongoose.model('influencer',influencerSChema)