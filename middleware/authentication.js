const DataBase = require("../db/db");
let includeuser = false;

async function signupuserchecker(req, res, next) {
  const db = await DataBase();
  const result = await db.collection("user").find().toArray();

  const userExists = result.some((user) => user.email === req.body.email);

  if (userExists) {
    res.send("user already exists, please login");
  } else {
    next();
  }
}

async function loginchecker(req, res, next) {
  const db = await DataBase();
  const result = await db.collection("user").find().toArray();

  const userExists = result.some((user) => user.email === req.body.email);

  if (userExists) {
    next();
  } else {
    res.send("user not extist please signup");
  }
}

module.exports = { signupuserchecker, loginchecker };
