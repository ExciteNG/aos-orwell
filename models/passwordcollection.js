/* eslint-disable prettier/prettier */
const mongoose = require("./init");

const fakeSchema = new  mongoose.Schema({
    firstName:{
        type:String
    },
    lastName:{
        type:String
    },
    emailAddress:{
        type:String
    },
    token:{
        type:String,
        default:""
    }
})


module.exports = mongoose.model('fakeUserSchema',fakeSchema);