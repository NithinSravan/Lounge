const express = require('express');
const scoreCard=require("../models/scoreCard");
const Game=require('../models/game');
const auth=require("../middleware/auth");
const multer=require("multer");
const unzipper = require('unzipper')
const fs=require('fs');
const game = require('../models/game');
const { url } = require('inspector');
// async function main () {
//   try {
//     await extract(source, { dir: target })
//     console.log('Extraction complete')
//   } catch (err) {
//     // handle any errors
//   }
// }

const router = express.Router();

// const cors=require('cors');

// router.options('/add-game',async(req,res)=>{
//   res.setHeader("Access-Control-Allow-Origin","*")
//   res.setHeader("Access-Control-Max-Age","600");
//   res.status(200).json({});
//  });

const MIME_TYPE_MAP={
  'application/x-zip-compressed':'zip'
};

const storage=multer.diskStorage({
  destination:(req,file,cb)=>{
    console.log(file.mimetype)
    const isValid=MIME_TYPE_MAP[file.mimetype];
    let error=new Error("Invalid mime type");
    if(isValid){
      error=null;
    }
    else{
      cb(error,"allgameszip");
    }
    cb(null,"allgameszip");
  },
  filename:(req,file,cb)=>{
    const name=file.originalname.toLowerCase().split(' ').join('-');
    const ext=MIME_TYPE_MAP[file.mimetype];
    cb(null,name+'-'+Date.now()+'.'+ext);
  }
});




router.post("/add-game",multer({storage}).single('file'),async(req,res)=>{
try{
  const filename=req.file.filename;
  const ogfilename=req.file.originalname;
  const gamename=req.body.gamename
  fs.createReadStream(`allgameszip/${filename}`)
  .pipe(unzipper.Extract({ path: 'allgames' }));
  const url='https://loungeinc.herokuapp.com/'+ogfilename+"/index.html";
  const game=new Game({
    url:url,
    gamename:gamename
  })
  await game.save()
  res.status(200).json(game)
}catch(e){
  res.status(500).send(e)
}
});
router.get("/games",async(req,res)=>{
  const games=await Game.find();
  // console.log(games)
  res.status(200).json({games});
 });
router.get("/scores/:gamename",async(req,res)=>{
  console.log(req.params.gamename)
  const game=await Game.findOne({gamename:req.params.gamename})
  const scores=await scoreCard.find({gameId:game._id}).sort({best:-1});
  res.status(200).json({scores});
 });
router.post("/score",auth,async(req,res)=>{
  try {
    console.log(req.body.gamename,"gamename")
    const game=await Game.findOne({gamename:req.body.gamename})
    let score= await scoreCard.findOne({player:req.userData.userId,gameId:game._id});
    // console.log(score)
     if(!score){
      score=new scoreCard({
        gameId:game._id,
        best:req.body.score,
        player:req.userData.userId,
        playername:req.userData.username
      });
      // console.log(game)
      await score.save();
     }
     else if(score.best<req.body.score){
       score.best=req.body.score;
       await score.save();
     }
     const scorecard={
      id:score._id,
      gameId:score.gameId,
      best:score.best,
      player:score.player,
      playername:score.playername
     }
    res.status(201).json({message:"Score added!",scorecard})
} catch (e) {
    res.status(400).send(e)
}
});


module.exports=router;
