/* eslint-disable prettier/prettier */
const mongoose = require('./init');
const Deals = new mongoose.Schema({
    productName:{
        type:String,
        required:true
    },
    target:{
        type:String
    },
    category:{
        type:String,
        required:true
    },
    previousPrice:{
        type:Number,
        default:0
    },
    DealPrice:{
        type:Number,
        default:0
    },
    DealEnds:{
        type:Date,
        required:true
        // default:new Date()
    },
    Description:{
        type:String
    },
    approved:{
        type:Boolean,
        default:false
    },
    image:{
        type:String,
        required:true
    }   

})


module.exports = mongoose.model('Deal',Deals)