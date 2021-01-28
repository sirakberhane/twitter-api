const express = require("express");
express.Router({ mergeParams: true});
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');

const authRoute = require('./routes/auth');
const tweets = require('./routes/tweets');
const chats = require('./routes/chats');

app.enable("trust proxy");
dotenv.config();

// Connect to mongoDB -- Using MongoDB Atlas database
mongoose.connect(process.env.MONGODB_CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true }, () => console.log('Connected to MongoDB!'));

app.use(express.json());
app.use('/auth', authRoute);
app.use('/tweets', tweets);
app.use('/chats', chats);

// Catch any other route --> error if not defined route
app.all("*", (req, res) => { 
  res.status(404).send({ error: "Route not defined" });
});

let port = process.env.PORT || 3000; // Development server
console.log(`Listening on port ${port}.`);
app.listen(port);
