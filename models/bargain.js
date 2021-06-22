const mongoose = require('./init')

const bargainSchema = mongoose.Schema({
    sender:{
        type:String,
        required:true
    },
    receiver:{
        type:String
    },
    messages:{
        type:String,
        default:""
    }
},{timestamps:true})


module.exports = mongoose.model('bargain',bargainSchema)