const mongoose=require('mongoose');
const uniqueValidator=require('mongoose-unique-validator');

const gameSchema = new mongoose.Schema({
  url:{
    type:String,
    default:null,
    required:true
  },
gamename:{
  type:String,
  unique:true,
  required:true
}
});

gameSchema.plugin(uniqueValidator);

module.exports=mongoose.model("Game",gameSchema);
