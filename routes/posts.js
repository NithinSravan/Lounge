const express = require("express");
const multer=require("multer");
const auth=require("../middleware/auth")
const PostsController=require('../controllers/posts')

const router = express.Router();

const MIME_TYPE_MAP={
  'image/png':'png',
  'image/jpeg':'jpeg',
  'image/jpg':'jpg'
};

const storage=multer.diskStorage({
  destination:(req,file,cb)=>{
    const isValid=MIME_TYPE_MAP[file.mimetype];
    let error=new Error("Invalid mime type");
    if(isValid){
      error=null;
    }
    else{
      cb(error,"uploads/images");
    }
    cb(null,"uploads/images");
  },
  filename:(req,file,cb)=>{
    const name=file.originalname.toLowerCase().split(' ').join('-');
    const ext=MIME_TYPE_MAP[file.mimetype];
    cb(null,name+'-'+Date.now()+'.'+ext);
  }
});

router.post('',auth,multer({storage}).single('image'),PostsController.createPost);
router.get('',auth,PostsController.getPosts);
router.get("/:id",auth,PostsController.userProfile );
router.put("/like/:id",PostsController.likePost);

module.exports=router;
