const mongoose = require("mongoose");
const Model = mongoose.Schema(
  {
    name: {
      type: String,
      unique: true
    },
    position: {
      type: String
    },
    picture: {
      type: String
    },
    // voters: {
    //   type: Array,
    // },
    point: {
      type: Number
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("voters", Model);
