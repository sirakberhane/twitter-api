const JOI = require("joi");

// Username, password, email data validation
const registrationValidation = data => {
  const schema = JOI.object({
    username: JOI.string().min(3).required(),
    email: JOI.string().email(),
    password: JOI.string().min(6).required(),
  });
  return schema.validate(data);
};

const loginValidation = data => {
  const schema = JOI.object({
    username: JOI.string().min(3).required(),
    password: JOI.string().min(6).required(),
  });
  return schema.validate(data);
};

module.exports.registrationValidation = registrationValidation;
module.exports.loginValidation = loginValidation;