/* eslint-disable prettier/prettier */
const mongoose =  require('./init')
let emailRegexVal = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

const CheckBusinessName = mongoose.Schema({
    mostPreferred:{
        type:Object,
        required:true,
    },
    morePreferred:{
        type:Object,
        required:true,
    },
    status:{
        type:String,
        default: 'pending'
    },
    isAssigned: {
      type: Boolean,
      default: false
    },
    assignedTo: {
      type: mongoose.Schema.ObjectId,
      ref: 'Profiles'
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
    }
},
{ timestamps: true })

module.exports = mongoose.model('CheckName',CheckBusinessName)
