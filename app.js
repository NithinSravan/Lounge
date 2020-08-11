const express=require('express');
const path=require("path");
const bodyParser=require("body-parser");
const postRoutes=require("./routes/posts");
const userRoutes=require("./routes/user");
const gameRoutes=require("./routes/game")
const mongoose = require("mongoose");


mongoose.connect("mongodb+srv://nithin:yYlH15EJlV7eguyy@cluster0.5rcfs.mongodb.net/<dbname>?retryWrites=true&w=majority",{
  useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})
var cors = require('cors');

const app=express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use("/images",express.static(path.join("backend/uploads/images")));
app.use(express.static(path.join(__dirname,"allgames")));

app.use((req,res,next)=>{
  res.setHeader("Access-Control-Allow-Origin","*");
  // res.setHeader("Access-Control-Allow-Origin","http://localhost:4200");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.setHeader("Access-Control-Allow-Methods","GET,POST,PUT,PATCH,DELETE,OPTIONS");
  // res.setHeader("Access-Control-Max-Age","OPTIONS");

  next();

})

app.use(userRoutes);
app.use(gameRoutes);
app.use(postRoutes);


module.exports=app;
