const express = require('express');
const User = require('../models/user');
const bcrypt= require('bcrypt');
const jwt=require('jsonwebtoken');
const auth=require('../middleware/auth');
const Post=require("../models/post");

const router = express.Router();
router.post('/signup', async (req, res) => {
  const user = new User(req.body)
  try {
      user.password = await bcrypt.hash(user.password, 10)
      await user.save()
      // const token = await user.generateAuthToken()
      res.status(201).json({message:"User Created!",user})
  } catch (e) {
      res.status(400).send(e)
  }
})
router.post('/login',async (req,res)=>{
  try {
    const user = await User.findOne({ email: req.body.email })
    if (!user) {
        throw new Error('Unable to login')
    }

    const isMatch = await bcrypt.compare(req.body.password, user.password)

    if (!isMatch) {
        throw new Error('Unable to login')
    }

    const token = jwt.sign({ username:user.username,_id: user._id }, 'mybestkeptsecret',{expiresIn:"1h"})
    res.status(201).json({
      token,
      expiresIn:3600,
      userId:user._id,
      name:user.name,
      username:user.username
    })
} catch (e) {
    res.status(400).json({ message: "Kindly STFU and type the proper credentials" })
}

});
// router.get("/search", auth, async(req, res)=>{
//   const user= await User.find({username: {$ne: req.user.username}});
//   try {
//       res.status(201).json({user:{
//         userId:user.userId,
//         username:user.username,
//         name:user.name
//       }})
//   } catch (e) {
//       res.status(400).send(e)
//   }

// });
router.post("/search", auth, async(req, res) =>{
  let searchfriend = req.body.user;
  const loggedUser= await User.findOne({username:req.userData.username})
  try {
    if (searchfriend == loggedUser.username) {
      console.log("lol")
      searchfriend= null;
      }
      const user= await User.findOne({username: searchfriend});
      // console.log(user,"search")
      res.status(201).json({message:"User found",user:{
        userId:user._id,
        username:user.username,
        name:user.name
      }})
  } catch (e) {
      res.status(400).send(e)
  }
});
router.patch("/request",auth,async(req,res)=>{
  console.log(req.body.username)
  const sender= await User.findById(req.userData.userId);
  const receiver= await User.findOne({username:req.body.username});
  sender.sentRequest.push({username:receiver.username});
  receiver.request.push({userId:sender.userId,username:sender.username,name:sender.name});
  await sender.save();
  await receiver.save();
  console.log(sender,receiver)
  res.status(201).json({message:"Request Sent"})
});
router.get("/received-requests",auth,async(req,res)=>{
  const user= await User.findById(req.userData.userId);
  const requests=user.request;
  console.log(requests)
  res.status(201).json({requests})
});
router.patch("/unfollow",auth,async(req,res)=>{
  const sender= await User.findById(req.userData.userId);
  const receiver= await User.findOne({username:req.body.username});
  sender.friendsList=sender.friendsList.filter(frnd=>{
    return frnd.friendUsername!==receiver.username
  })
  receiver.friendsList=receiver.friendsList.filter(frnd=>{
    return frnd.friendUsername!==sender.username
  })
  receiver.totalFriends=receiver.friendsList.length;
  sender.totalFriends=sender.friendsList.length;
  await sender.save();
  await receiver.save();
  console.log(sender,receiver)
  res.status(201).json({message:"unfollowed!"})
});
router.patch("/accept",auth,async(req,res)=>{
  console.log(req.body.username)
  const accepter= await User.findById(req.userData.userId);
  const sender= await User.findOne({username:req.body.username});
  accepter.friendsList.push({friendId:sender.userId,friendName:sender.name,friendUsername:sender.username});
  sender.friendsList.push({friendId:accepter.userId,friendName:accepter.name,friendUsername:accepter.username});
  accepter.totalFriends=accepter.friendsList.length;
  sender.totalFriends=sender.friendsList.length;
  accepter.request=accepter.request.filter(data=>{
    return data.username!==sender.username
  })
  sender.sentRequest=sender.sentRequest.filter(data=>{
    return data.username!==accepter.username
  })
  await accepter.save();
  await sender.save();
  // console.log(accepter.request,sender.request)
  res.status(201).json({message:"Friends"})
});
router.patch("/reject",auth,async(req,res)=>{
  console.log(req.body.username)
  const rejecter= await User.findById(req.userData.userId);
  const sender= await User.findOne({username:req.body.username});
  rejecter.request=rejecter.request.filter(data=>{
    return data.username!==sender.username
  })
  sender.sentRequest=sender.sentRequest.filter(data=>{
    return data.username!==rejecter.username
  })
  await rejecter.save();
  await sender.save();
  console.log(rejecter.sentRequest,sender.request)
  res.status(201).json({message:"Pochaaa! Try again!!"})
});
router.get("/friendship-status/:id",auth,async(req,res)=>{
  const user= await User.findById(req.userData.userId);
  const searchedUser=await User.findById(req.params.id);
  const checkSent= user.sentRequest.filter(frnd=>{
    return frnd.username===searchedUser.username
  })
  const checkFriendsList= user.friendsList.filter(frnd=>{
    return frnd.friendUsername===searchedUser.username
  })
  const checkRequest=user.request.filter(frnd=>{
    return frnd.username===searchedUser.username
  })
  res.status(201).json({checkSent,checkFriendsList,checkRequest})
});
module.exports=router;
