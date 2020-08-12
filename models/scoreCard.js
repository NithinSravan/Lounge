const mongoose=require('mongoose');

const scoreCardSchema = new mongoose.Schema({
  gameId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Game',
    required:true
  },
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
