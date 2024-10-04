const express = require("express");
const DataBase = require("../../db/db");
const jwt = require("jsonwebtoken");

const signup = async function (req, res) {
  let email = req.body.email;
  let profile = req.body.profile;
  let username = req.body.username;
  let token = jwt.sign({ email, profile, username }, "music-application");
  try {
    const db = await DataBase();
    await db.collection("user").insertOne({
      profile,
      email,
      username,
    });
    res.json({
      status: true,
      message: "Login Succefull",
      data: token,
    });
  } catch (error) {
    console.log(error);
    let message = error.code === 11000 ? "User already exist" : error.errmsg;

    res.json({
      status: false,
      message,
      data: token ? token : null,
    });
  }
};
module.exports = {
  signup,
};
