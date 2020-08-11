const express = require("express");
const multer=require("multer");
const auth=require("../middleware/auth")
const Post=require("../models/post");
const User = require('../models/user');
const { pseudoRandomBytes } = require("crypto");
const { find } = require("../models/post");

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

router.post('',auth,multer({storage}).single('image'),async (req,res)=>{
  const url='https://loungeinc.herokuapp.com/';
  const post=new Post(
    {
     content:req.body.content,
     imagePath:url+"images/"+req.file.filename,
     likes:0,
     creator:req.userData.userId,
     creatorname:req.userData.username
    })
  await post.save()
  res.status(201).json({
    message:"Post Added!",
    post:{
      _id:post._id,
      content:post.content,
      imagePath:post.imagePath,
      likes:post.likes,
      likedBy:post.likedBy,
      creator:req.userData.userId,
      creatorname:req.userData.username
    }
  })
});
router.get('',auth,async (req,res)=>{
  let posts=await Post.find().sort('-createdAt');
  const user=await User.findById(req.userData.userId);
  posts=posts.filter(post=>{
    const friend=user.friendsList.filter(frnd=>{
      if(post.creatorname===frnd.friendUsername)
        return frnd.friendUsername
    })
    if(friend[0]||post.creatorname===user.username){
      if(friend[0]){
        if(friend[0].friendUsername===post.creatorname){
          return post
        }
      }else{
          return post
        }
      }

  })
  res.status(200).json({posts:[...posts]});


});
router.get("/:id",auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const posts = await Post.find({ creator:req.params.id }).sort("-createdAt");
    // console.log(posts);

    res.status(200).json({
      posts,
      name: user.name,
      username: user.username,
      totalFriends:user.totalFriends
    });
  } catch (e) {
    res.status(400).send(e);
  }
});
router.put("/like/:id",async(req,res)=>{
  const post=new Post(req.body);
  try{
    await Post.updateOne({_id:req.params.id},post);
    // console.log(post)
    res.status(200).json({
     post
    });
  }catch(e){
    res.status(400).send(e);
  }
});

module.exports=router;
