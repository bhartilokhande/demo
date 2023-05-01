const express = require('express');
const app = express();
const dotenv = require('dotenv');
const auth = require('./router/auth')
const admin = require('./router/admin')
const common = require('./router/common')
const user = require('./router/user')
const dbConnect = require('./helper/database');
const bodyparser = require('body-parser');  
const cors = require('cors');



const fs = require('fs');
const crypto = require('crypto');


const fileBuffer = fs.readFileSync('./userDummy.jpeg')
const hash = crypto.createHash('sha256')
const finalHex = hash.update(fileBuffer).digest('hex');
console.log(finalHex);
                    
           


app.use(bodyparser.urlencoded({extended:true}))
app.use(bodyparser.json());

dotenv.config();
app.use(cors());
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use('/auth',auth)
app.use('/admin',admin)
app.use('/user',user)
app.use('/',common)
app.use('/upload',express.static('upload'))





dbConnect(process.env.DB_URL)
app.listen(process.env.PORT,(err) => {
    if(!err){
        console.log(`server is listening on port no:${process.env.PORT}`)
    }else{
        console.log("server connection error",err)
    }
})






