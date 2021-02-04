const mongoose = require("mongoose");
const { Schema } = mongoose;


const userSchema = new Schema({
    userName:{
        type:String
    },
    email:{
        type:String
    },
    password:{
        type:String
    },
    mobileNo:{
        type:String
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    createdBy:{
        type:mongoose.Types.ObjectId,
        ref:'user'
    }
})

module.exports = mongoose.model('user', userSchema);