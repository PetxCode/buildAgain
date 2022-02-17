const mongoose = require("mongoose");
const userModel = mongoose.Schema(
  {
    name: {
      type: String
    },
    email: {
      type: String,
      unique: true
    },

    password: {
      type: String
    },
    isAdmin: {
      type: Boolean,
      default: false
    },
    picture: {
      type: String
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("login", userModel);
