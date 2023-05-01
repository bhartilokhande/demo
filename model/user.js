const mongoose = require('mongoose');
var url = "https://i.stack.imgur.com/34AD2.jpg";

const UserSchema = mongoose.Schema({
    email:{
        type: String,
        trim: true
    },
    password:{
        type: String,
        trim: true
    },
    encryptPassword:{
       type:String,
       trim:true
    },
    name:{
        type: String,
    },
    designation:{
        type: String
    },
    profilePic:{
          type: String,
          default:url
    },
    role:{
        type: Number,
    },
}, { timestamps: true });


const User = mongoose.model("User", UserSchema);
module.exports = User;

