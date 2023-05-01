
const mongoose = require('mongoose');

const LeaveSchema = mongoose.Schema({
    user:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"User"
    },
    startDate:{
        type:Date
    },
    endDate:{
        type:Date
    },
    Leavetype:{
        type:String
    }, 
    period:{
        type:Number
    },
    reason:{
           type:String
    },
    status:{
        type:String,
        default:"pending"
    }
},{timestamps:true});

const Leave = mongoose.model("Leave",LeaveSchema);
module.exports = Leave;