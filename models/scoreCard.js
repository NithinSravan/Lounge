// mongoAtlas password: yYlH15EJlV7eguyy
const mongoose=require('mongoose');
  // gameId:{
  //   type:mongoose.Schema.Types.ObjectId,
  //   ref:'Game',
  //   required:true
  // },
const scoreCardSchema = new mongoose.Schema({

  best:{
    type:Number,
    required:true
  },
 player:{
   type: mongoose.Schema.Types.ObjectId,
   ref:"User",
   required:true
 },
 playername:{
  type: String,
  ref:"User",
  required:true
}
});

module.exports=mongoose.model("scoreCard",scoreCardSchema);
