const mongoose = require('mongoose');

module.exports = function connect(dbUrl){
    if(mongoose.connection){
        mongoose.connection.close();
    }

    mongoose.set("strictQuery", false);
    mongoose.connect(dbUrl,{
        useNewUrlParser:true,
        useUnifiedTopology:true
    },(err) => {
        if(err){
            console.log("err",err)
        }else{
            console.log("Database connected successfully")
        }
    })
}