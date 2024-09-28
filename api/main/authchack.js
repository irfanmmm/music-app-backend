const jwt = require("jsonwebtoken");
const DataBase = require("../../db/db");

const AuthCheck = async (req, res, next) => {
  let token = req.headers.authorization;
  try {
    let validatetoken = jwt.verify(token, "music-application");

    next();
  } catch (error) {
    res.status(401).json({
      status: false,
      message: "Unauthorized Request",
    });
  }
};

module.exports = AuthCheck;
