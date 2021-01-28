const express = require("express");
const router = express.Router();
const User = require("../model/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { registrationValidation, loginValidation } = require("../validation");
const { authentication } = require("../middleware/verifyJWT");

// Section 1: Registration route
router.post("/register", async (req, res) => {
  const { error } = registrationValidation(req.body);
  if (error) {  // Check that there is no errors, if there is send server status error 500
    return res.status(500).send({ error_message: error.details[0].message });
  }

  // Check that the username doesn't exist
  const usernameExists = await User.findOne({ username: req.body.username });
  if (usernameExists) {
    return res.status(500).send({ error_message: "Username already exists." });
  }

  // Hash the password, so that mongoDB is not saving the actual password in text HASH(password + salt)
  const salt = await bcrypt.genSalt(10);
  const hash_password = await bcrypt.hash(req.body.password, salt);

  const user = new User({
    username: req.body.username,
    password: hash_password,
    email: req.body.email,
  });

  try {
    const newUser = await user.save(); // Add the new user to mongoDB
    res.send({ _id: newUser._id, date_created: newUser.date_created });
  } catch (err) {
    res.status(500).send(err);
  }
});

// Section 1: User Login route + session token (JWT)
router.post("/login", async (req, res) => {
  const { error } = loginValidation(req.body);
  if (error) {  // Check that there is no errors, if there is send server status error 500
    return res.status(500).send({ error_message: error.details[0].message });
  }

  // Check that the username exists
  const user_data = await User.findOne({ username: req.body.username });
  if (!user_data) {  // Check that there is no errors, if there is send server status error 500
    return res.status(500).send({ error_message: "Username does not exist." });
  }

  // Match the password with the hashed password in database
  const checkPassword = await bcrypt.compare(req.body.password, user_data.password);
  if (!checkPassword) {  // Check that there is no errors, if there is send server status error 500
    return res.status(500).send({ error_message: "Password is invalid." });
  }

  // Username exists and Password was correct --> Login the user + create the JWT token
  const token = jwt.sign({ _id: user_data._id, username: user_data.username }, process.env.PRIVATE_KEY);
  res.header("access-token", token);
  res.send({
    _id: user_data._id,
    username: user_data.username,
    token: token,
    account_creation: user_data.date_created,
    success: true,
  });
});

// If logged in, users can view other users
router.get("/users", authentication, async (req, res) => { 
  await User.find({}, {password: 0}, (err, allUsers) => {
    if (err) {  // Check that there is no errors, if there is send server status error 500
      return res.status(500).send({ error_message: "No users were found" });
    }

    if (allUsers) {
      return res.send(allUsers);
    } else {
      return res.status(400).send({ error_message: "No users were found" });
    }
  }).sort({ date_created: -1 }); // Sort by the newest user by default
})

// Catch any other route --> error if not defined route
router.all("*", (req, res) => {
  res.status(404).send({ error: "Route not defined" });
});

module.exports = router;
