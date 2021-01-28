const express = require("express");
const router = express.Router({ mergeParams: true });
// const Chat = require("../model/Chat");
const { authentication } = require("../middleware/verifyJWT");

// TODO ~ Section 2: Chat with other users
router.get("/", authentication, async (req, res) => {
  res.send("Chat with other users");
});

// Catch any other route --> error if not defined route
router.all("*", (req, res) => {
  res.status(404).send({ error: "Route not defined" });
});

module.exports = router;
