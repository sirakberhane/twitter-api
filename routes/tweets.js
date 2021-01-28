const express = require("express");
const router = express.Router({ mergeParams: true });
const Tweet = require("../model/Tweet");
const { authentication } = require("../middleware/verifyJWT");

// Look at all the tweets
router.get("/", authentication, async (req, res) => {
  await Tweet.find({}, (err, allTweets) => {
    if (err) { // Check that there is no errors, if there is send server status error 500
      return res.status(500).send({ error_message: "No tweets were found" });
    }

    if (allTweets) { // If no issues were found send all of the tweets
      return res.send(allTweets);
    } else {
      return res.status(400).send({ error_message: "No tweets were found" });
    }
  }).sort({ date_created: -1 }); // Sort the tweets by newest first
});

// Section 2: Read a tweet route ~ finds one tweet by tweet_id
router.get("/:tweet_id", authentication, async (req, res) => {
  await Tweet.find({ _id: req.params.tweet_id }, (err, oneTweet) => {
    if (err) { // Check that there is no errors, if there is send server status error 500
      return res.status(500).send({ error_message: "No tweets were found" });
    }

    if (oneTweet) { // If no issues were found send the tweet
      return res.send(oneTweet);
    } else {
      return res.status(400).send({ error_message: "No tweets were found" }); // Not tweet was found by that ID
    }
  });
});

// Section 2: Create a new tweet route
router.post("/create", authentication, async (req, res) => {
  const tweet = new Tweet({
    user_id: req.user_data._id,
    username: req.user_data.username,
    content: req.body.content,
  });

  try {
    const newTweet = await tweet.save(); // Save the new tweet to MongoDB
    res.send(newTweet); // Show what was saved to the database 
  } catch (err) {
    res.status(500).send(err); // Error occured while saving tweet to DB
  }
});

// Section 2: Update a existing tweet route
router.post("/:tweet_id/update", authentication, async (req, res) => {
  await Tweet.findOne({
      user_id: req.user_data._id,
      username: req.user_data.username,
      _id: req.params.tweet_id,
    },
    (err, oneTweet) => {
      if (err) { // Check that there is no errors, if there is send server status error 500
        return res.status(500).send({ error_message: "No tweets were found" });
      }

      if (oneTweet) {
        return res.send({
          success: true,
          success_message: `Updated a tweet with ID of ${req.params.tweet_id}`,
        });
      } else {
        return res.status(400).send({ error_message: "No tweets were found" });
      }
    }
  ).updateOne({ // Update the tweet's content and update the time when the tweet was edited
    content: req.body.content,
    date_edited: new Date(),
    edited: true, // Flag as edited tweet
  });
});

// Section 2: Delete a existing tweet route
router.post("/:tweet_id/delete", authentication, async (req, res) => {
  await Tweet.deleteOne({
      user_id: req.user_data._id,
      username: req.user_data.username,
      _id: req.params.tweet_id,
    },
    (err, oneTweet) => {
      if (err) { // Check that there is no errors, if there is send server status error 500
        return res.status(500).send({ error_message: "No tweets were found" });
      }

      if (oneTweet) {
        return res.send({
          success: true,
          success_message: `Deleted a tweet with ID of ${req.params.tweet_id}`,
        });
      } else {
        return res.status(400).send({ error_message: "No tweets were found" });
      }
    }
  );
});

// Section 3: Like a tweet route
router.post("/:tweet_id/like", authentication, async (req, res) => {
  await Tweet.findOne({ _id: req.params.tweet_id },
    (err, oneTweet) => {
      if (err) {  // Check that there is no errors, if there is send server status error 500
        return res.status(500).send({ error_message: "No tweets were found" });
      }

      if (oneTweet) {
        return res.send({
          success: true,
          success_message: `Liked a tweet with ID of ${req.params.tweet_id}`,
        });
      } else {
        return res.status(400).send({ error_message: "No tweets were found" });
      }
    }).updateOne({
    $addToSet: { // This only add the user to the record once (unique)
      likes: { user_id: req.user_data._id, username: req.user_data.username }, // Save which user liked the tweet
    }});
});

// Section 3: Unlike a tweet route
router.post("/:tweet_id/unlike", authentication, async (req, res) => {
  await Tweet.findOne({ _id: req.params.tweet_id },
    (err, oneTweet) => {
      if (err) {  // Check that there is no errors, if there is send server status error 500
        return res.status(500).send({ error_message: "No tweets were found" });
      }

      if (oneTweet) {
        return res.send({
          success: true,
          success_message: `Unliked a tweet with ID of ${req.params.tweet_id}`,
        });
      } else {
        return res.status(400).send({ error_message: "No tweets were found" });
      }
    }).updateOne({
    $pull: {
      likes: { user_id: req.user_data._id, username: req.user_data.username }, // Remove the user from the liked record
    }});
});

// Section 3: Retweet route
router.post("/:tweet_id/retweet", authentication, async (req, res) => {
  var tempTweet;
  await Tweet.find({ _id: req.params.tweet_id }, (err, oneTweet) => {
    if (err) {  // Check that there is no errors, if there is send server status error 500
      console.log({ error_message: "No tweets were found" });
    }

    if (oneTweet) {
      tempTweet = oneTweet;
    } else {
      console.log({ error_message: "No tweets were found" });
    }
  });

  await Tweet.find({ _id: req.params.tweet_id },
    (err, oneTweet) => {
      if (err) {  // Check that there is no errors, if there is send server status error 500
        console.log({ error_message: "No tweets were found" });
      }

      if (oneTweet) {} else {
        console.log({ error_message: "No tweets were found" });
      }
    }).updateOne({
      $addToSet: { // This only add the user to the record once (unique)
        retweets: { user_id: req.user_data._id, username: req.user_data.username }, // Save which user liked the tweet
      }
    });

  const tweet = new Tweet({
    user_id: req.user_data._id,
    username: req.user_data.username,
    content: tempTweet[0].content,
    retweeted: true,
    retweets: tempTweet[0].retweets,
    retweeted_id: tempTweet[0]._id
  });

  try {
    const newTweet = await tweet.save(); // Save the new tweet to MongoDB
    // Show what was saved to the database
    res.send({ success: true, success_message: `Retweeted a tweet with ID of ${req.params.tweet_id}`, tweet: newTweet});
  } catch (err) {
    res.status(500).send(err); // Error occured while saving tweet to DB
  }
});

// TODO ~ Section 3: Threading

// Catch any other route --> error if not defined route
router.all("*", (req, res) => {
  res.status(404).send({ error: "Route not defined" });
});

module.exports = router;
