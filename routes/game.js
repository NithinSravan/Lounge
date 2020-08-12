const express = require('express');
const multer=require("multer");
const auth=require("../middleware/auth");
const GameController=require('../controllers/game')

const router = express.Router();

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

router.post("/add-game",multer({storage}).single('file'),GameController.addGame);
router.get("/games",GameController.games);
router.get("/scores/:gamename",GameController.gameScore);
router.post("/score",auth,GameController.updateScore);

module.exports=router;
