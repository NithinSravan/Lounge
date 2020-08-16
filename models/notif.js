const mongoose = require("mongoose");

const notifSchema = new mongoose.Schema(
  {
    message:{
      type: String,
      default:''
    },
    username:{
      type: String,
      default:''
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Notif",notifSchema);

