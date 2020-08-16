const mongoose=require('mongoose');
const jwt=require('jsonwebtoken');
const validator = require('validator')
const bcrypt= require('bcrypt');
const uniqueValidator=require('mongoose-unique-validator');

const userSchema = new mongoose.Schema({
  name: {
      type: String,
      required: true,
      trim: true
  },
  username:{
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
            throw new Error('Email is invalid')
        }
    }
  },
  password: {
      type: String,
      required: true,
      minlength: 7,
      trim: true
  },
  sentRequest:[{
    username: {
      type: String,
      default: ''
    }
  }],
  request: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    username: {
      type: String,
      default:''
    },
    name:{
      type: String,
      default:''
    }
  }],
  friendsList: [{
    friendId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    friendName: {
      type: String,
      default:''
    },
    friendUsername: {
      type: String,
      default:''
    }
  }],
  totalFriends: {
    type: Number,
    default:0
  }
});

userSchema.plugin(uniqueValidator);

module.exports=mongoose.model("User",userSchema);
