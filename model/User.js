const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    min: 3,
    unique: true
  },
  password: {
    type: String,
    required: true,
    max: 1024
  },
  email: {
    type: String,
    required: false,
    default: null,
    min: 6
  },
  date_created: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model("User", userSchema);
