/* eslint-disable prettier/prettier */
const mongoose = require("./init");


const backUpSchema = new  mongoose.Schema({

    firstName:{
        type:String,
        default:""
    },
    lastName:{
        type:String,
        default:""
    },
    email:{
        type:String,
        default:""
    },
    Token:{
        type:String,
        default:""
    },
    resetToken:{    
        type:Number,
        default:Date.now()
    }
    
})


module.exports = mongoose.model('backup',backUpSchema);