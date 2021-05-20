/* eslint-disable prettier/prettier */
const mongoose = require('./init');
const invoiceModel = mongoose.Schema({
    productName:{
        type:String
    },
    

});


module.exports = invoiceModel;