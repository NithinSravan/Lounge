// mongoAtlas password: yYlH15EJlV7eguyy
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
// userSchema.methods.generateAuthToken = async function () {
//   const user = this
//   const token = jwt.sign({ email:user.email,_id: user._id.toString() }, 'mybestkeptsecret',{expiresIn:"1h"})

//   user.tokens = user.tokens.concat({ token })
//   await user.save()

//   return token
// }

// userSchema.statics.findByCredentials = async (email, password) => {
//   const user = await User.findOne({ email })

//   if (!user) {
//       throw new Error('Unable to login')
//   }

//   const isMatch = await bcrypt.compare(password, user.password)

//   if (!isMatch) {
//       throw new Error('Unable to login')
//   }

//   return user
// }

// userSchema.pre('save', async function (next) {
//   const user = this

//   if (user.isModified('password')) {
//       user.password = await bcrypt.hash(user.password, 8)
//   }

//   next()
// })
userSchema.plugin(uniqueValidator);

module.exports=mongoose.model("User",userSchema);
