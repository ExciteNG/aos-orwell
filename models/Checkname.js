/* eslint-disable prettier/prettier */
const mongoose =  require('./init')
let emailRegexVal = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

const CheckBusinessName = mongoose.Schema({
    mostPreferred:{
        type:String,
        required:true,
        unique:true
    },
    morePreferred:{
        type:String,
        required:true,
        unique:true
    },
    other:{
        type:String,
        required:true,
        unique:true
    },
    status:{
        type:String,
        default: 'pending'
    },
    email:{
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
