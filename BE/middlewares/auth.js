const {User} = require('../Models/user.model')
const jwt = require("jsonwebtoken")
require("dotenv").config();

const isAuthenticated = async (req, res, next) => {
  try {
    let token = req.header("Authorization");
    if (!token || !token.startsWith("Bearer"))
      return res
        .status(401)
        .send({ message: "Please provide the token.", isOk: false });

    token = token.split(" ")[1];
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    if (!decoded)
      return res.status(403).send({ message: "Token expired!", isOk: false });
    const user = await User.findById(decoded.id);
    req.user = user;
    next();
  } catch (error) {
    return res
      .status(500)
      .send({
        message: "Internal Server Error",
        error: error.message,
        isOk: false,
      });
  }
};

module.exports = {isAuthenticated}
