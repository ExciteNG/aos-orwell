/* eslint-disable prettier/prettier */
const mongoose =  require('./init')

let phoRegexVal = new RegExp('^\\+\[0-9]+$');
let emailRegexVal = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

const CheckBusinessName = mongoose.Schema({

    Option1:{
        type:String,
        required:true,
        unique:true
    },
    Option2:{
        type:String,
        required:true,
        unique:true
    },
    Option3:{
        type:String,
        required:true,
        unique:true
    },
    phoneNo:{
        type:String,
        validate:{
            validator:function(v){
                return phoRegexVal.test(v)
            },
            message: props => `${props.value} is not a valid phone number!, please enter your phonee number with a country code with no spaces`
        },
        required: [true, 'phone number required']
    },

    email:{
        type:String,
        validate:{
            validator:function(v){

                return emailRegexVal.test(v)
            },
            message:mail => `${mail.value} is not a valid emmail address !`
        },
        required:[true,'Please enter your email address']
    },
    address:{
        type:String
    },
    kycdirectors:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'kycDirectors'
    },
    kyshareholders:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'kycShareholders'
    },
    kycsecretary:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'kycSecretary'
    },
    SharedAllocationStructure:{
        type:[String],
        required:true
    }

})


module.exports = mongoose.model('CheckName',CheckBusinessName)