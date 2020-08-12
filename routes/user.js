const express = require('express');
const UserController=require('../controllers/user');
const auth=require('../middleware/auth');


const router = express.Router();
router.post('/signup',UserController.signup )
router.post('/login',UserController.login);
router.post("/search", auth,UserController.search );
router.patch("/request",auth,UserController.friendRequest);
router.get("/received-requests",auth,UserController.receivedRequests);
router.patch("/unfollow",auth,UserController.unfollow);
router.patch("/accept",auth,UserController.accept);
router.patch("/reject",auth,UserController.reject);
router.get("/friendship-status/:id",auth,UserController.friendship);
module.exports=router;
