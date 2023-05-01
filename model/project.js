const mongoose = require('mongoose');

const ProjectSchema = mongoose.Schema({

   projectName:{
    type:String,
    trim:true
   },
   project_member:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User"
   }],
   status:{
    type:String
   }

},{timestamps:true});


const Project = mongoose.model("Project",ProjectSchema)
module.exports = Project;