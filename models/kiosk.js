/* eslint-disable standard/object-curly-even-spacing */
/* eslint-disable prettier/prettier */
const mongoose = require('./init');

const kioskSchema = mongoose.Schema({
    fullName:{
        type:String,
        required:true
    },
    email:{
        type:String,
    },
    phoneNumber:{
        type:String,
        required:true
    },
    kioskAddress:{
        type:String,
        required:true
    },
    lga:{
        type:String
    },
    state:{
        type:String
    },
    productType:{
        type:String
    },
    businessDesc:{
        type:String
    },
    kioskType:{
        type:String
    },
    floor:{
        type:String
    },
    roof:{
        type:String
    },
    doors:{
        type:String
    },
    price:{
        type:String
    },
    paymentType:{
        type:String

    }

})

module.exports = mongoose.model('kiosk',kioskSchema);

//todo

//create  a crud and adminuuu0 x 