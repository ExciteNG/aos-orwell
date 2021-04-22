/* eslint-disable prettier/prettier */
const mongoose = require("./init");
let phoRegexVal = new RegExp('^\\+\[0-9]+$');
let emailRegexVal = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

const loanSchema = mongoose.Schema({
    surname:{
        type:String,
        required:true
    },
    firstName:{
            type:String,
            required:true
    },
    lastName:{
        type:String,
    },
    Gender: {
        type: String,
        enum : ['Male','Female'],
        default:"Male",
        required:true
    },
    DateOfBirth:{
        type:Date,
        required:true
    },
    StateOfOrigin:{
        type:String
    },
    LocalGovernmentArea:{
        type:String
    },
    StreetNumber:{
        type:String
    },
    ResidentialAddress:{
        type:String
    },
    Email:{
        type:String,
        unique:true,
        validate:{
            validator:function(v){
                return emailRegexVal.test(v)
            },
            message:mail => `${mail.value} is not a valid email address !`
        },
        required:[true,'Please enter your email address']
    },
    MobileNumber:{
        type:String,
        validate:{
            validator:function(v){
                return phoRegexVal.test(v)
            },
            message: props => `${props.value} is not a valid phone number!, please enter your phonee number with a country code with no spaces`
        },
        required: [true, 'phone number required'],
        unique:true
    },
    MobileNumber2:{
        type:String,
        required:false,
        validate:{
            validator:function(v){
                return phoRegexVal.test(v)
            },
            message: props => `${props.value} is not a valid phone number!, please enter your phonee number with a country code with no spaces`
        }
    },
    nextOfKin:{
        type:Array,
        default:[{
            Surname:{type:String,required:true},
            middleName:{type:String},
            firstName:{type:String,required:true},
            Relationship:{type:String},
            Email:{type:String,validate:{ validator:function(v){return emailRegexVal.test(v)},message:mail => `${mail.value} is not a valid email address !`}}}],
            MobileNo:{type:String,validate:{validator:function(v){return phoRegexVal.test(v)},message: props => `${props.value} is not a valid phone number!, please enter your phonee number with a country code with no spaces`}}
    },
    EmploymentStatus:{
        type:String,
        enum:['Employed','Unemployed'],
        required:true
    },
    EducationalBackground:{
        type:String,
        required:true
    },
    MonthlyIncome:{
        type:String,
    },
    PayDay:{
        type:Date,
    },
    MaritalStatus:{
        type:String,
    },
    AnnualRent:{
        type:String,
    },
    OutstandingLoan:{
        type:String,
    },
    authy_id:{
        type:String
    },
    token:{
        type:String
    },
    Signature:{
        type:String
    },
    verified:{
        type:String,
        default:false
    }
})


module.exports=mongoose.model("loan",loanSchema)