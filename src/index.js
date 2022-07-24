
const express= require('express')
const bodyParser = require("body-parser");
const mongoose= require('mongoose')
const router=require('./route/route')
const app=express();

app.use(bodyParser.json());

const url="mongodb+srv://aditisah:HdtoVDUgrpCUNRmS@cluster0.jjd4zhp.mongodb.net/group51Database?retryWrites=true&w=majority"
mongoose.connect(url,{useNewUrlParser:true})

.then(()=>console.log("mongoose  connected"))
.catch(err=>console.log(err));

app.use('/',router);

app.listen(process.env.PORT || 3000, function(){
    console.log('Express app running on port'+(process.env.PORT || 3000))
})