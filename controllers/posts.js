const Post = require("../models/post");
const User = require("../models/user");

exports.createPost = async (req,res)=>{
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
};
exports.getPosts = async (req,res)=>{
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
};
exports.userProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const posts = await Post.find({ creator:req.params.id }).sort("-createdAt");
    res.status(200).json({
      posts,
      name: user.name,
      username: user.username,
      totalFriends:user.totalFriends
    });
  } catch (e) {
    res.status(400).send(e);
  }
};
exports.likePost =async(req,res)=>{
  const post=new Post(req.body);
  try{
    await Post.updateOne({_id:req.params.id},post);
    res.status(200).json({
     post
    });
  }catch(e){
    res.status(400).send(e);
  }
};
