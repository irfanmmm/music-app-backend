const DataBase = require("../../db/db");
const jwt = require("jsonwebtoken");

const signup = async function (req, res) {
  let email = req.body.email;
  let profile = req.body.profile;
  let username = req.body.username;
  let notificationid = req.body.notificationid;
  let token = jwt.sign({ email, profile, username }, "music-application");
  try {
    const db = (await DataBase()).collection("users");

    const user = await db.findOne({ email });
    console.log(user);
    
    if (user) {
      console.log('user alredy existe : ', user?.email);
      
      await db.updateOne(
        { email },
        {
          $set: {
            notificationid,
          },
        }
      );
      return res.json({
        status: true,
        message: "Login Succefull",
        data: token,
      });
    }
    await db.insertOne({
      profile,
      email,
      username,
      notificationid,
    });
    res.json({
      status: true,
      message: "Login Succefull",
      data: token,
    });
  } catch (error) {
    let message =
      error.code === 11000 ? "User already exist" : error.toString();

    res.json({
      status: false,
      message,
    });
  }
};
module.exports = {
  signup,
};
