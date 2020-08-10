// mongoAtlas password: yYlH15EJlV7eguyy
const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true
    },
    imagePath: {
      type: String,
      required: true
    },
    likes: {
      type: Number,
      default: 0
    },
    likedBy: [
      {
        liker: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          default: null
        },
        likername: {
          type:String,
          ref: "User",
          default: null
        }
      }
    ],
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    creatorname: {
      type: String,
      ref: "User",
      required: true
    },
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Post", postSchema);
