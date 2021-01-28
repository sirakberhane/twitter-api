const jwt = require("jsonwebtoken");

const authentication = (req, res, next) => {
  const access_token = req.header("access-token");
  if (!access_token) {
    return res.status(401).send({ error_message: "Access denied." });
  }

  try {
    const verifiedAccessToken = jwt.verify(access_token, process.env.PRIVATE_KEY);
    req.user_data = verifiedAccessToken;
    next();
  } catch (error) {
    res.status(400).send({ error_message: "Invaild access_token." });
  }
};

module.exports.authentication = authentication;