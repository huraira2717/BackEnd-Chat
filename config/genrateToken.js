const JWT = require("jsonwebtoken");

const generateToken = (id) => {
  return JWT.sign({ id }, process.env.JWT_SECRET_KEY, {
    expiresIn: "30d",
  });
}
module.exports = generateToken;
