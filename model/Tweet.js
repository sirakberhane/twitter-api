const mongoose = require("mongoose");

const tweetSchema = new mongoose.Schema({
  user_id: {
    type: String
  },
  username: {
    type: String
  },
  content: {
    type: String,
    required: true,
    max: 280 
  },
  date_created: {
    type: Date,
    default: Date.now,
  },
  date_edited: {
    type: Date,
    default: Date.now,
  },
  edited: {
    type: Boolean,
    default: false
  }, 
  likes: Array,
  retweets: Array
});

module.exports = mongoose.model("Tweet", tweetSchema);
