const jwt = require("jsonwebtoken");
const User = require("../models/users/user.model");
require("dotenv").config();

const JWT_TOKEN = process.env.JWT_SECRET || "eheeewhwwjhhdud";

const auth = async (req, res, next) => {
  let token;

  token =
    req.headers.token ||
    req.headers["authorization"]?.split(" ")[1] ||
    req.cookies?.token;

  if (token) {
    try {
      console.log("===== step 1 =======");
      console.log(token);
      const decoded = jwt.verify(token, JWT_TOKEN);

      console.log("===== step 2 =======");
      console.log(decoded);

      req.user = await User.findById(decoded.userId).select("-password");

      console.log("===== step 3=======");

      next();
    } catch (error) {
      console.error(error);
     return res.status(401).json({
      message: "Not authorized, token failed",
     });
    }
  } else {
    return res.status(401).json({
      message: "Not authorized, no token"
    });
  }
};

module.exports = auth;