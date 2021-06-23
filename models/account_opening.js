/* eslint-disable prettier/prettier */
const mongoose = require('./init')


const accountSchema = mongoose.Schema({
    bvn:{
        type:String,
        unique:true
    },
    dateOfBirth:{
        type:String,
    },
    gender:{
        type:String
    },
    CompanyCode:{
        type:true
    },
    phone:{
        type:String
    },
    email:{
        type:String,
        unique:true
    },
     homeAddress:{
         type:String
     },
    firstName:{
        type:String
    },
    lastName:{
        type:String
    },middleName:{
        type:String
    },
    city:{
        type:String
    }, hash:{
        type:String
    }, state:{
        type:String
    }, imageType:{
        type:String
    },signatureType:{
        type:String
    },
    image:{
        type:String
    }, signature:{
        type:String
    }
});

module.exports = mongoose.model('account',accountSchema)