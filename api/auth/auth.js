const express = require("express");
const DataBase = require("../../db/db");

const signup = async function (req, res) {
  let email = req.body.email;
  let password = req.body.password;

  try {
    let db = await DataBase();
    await db.collection("user").insertOne({
      email,
      password,
    });
    res.send("user signed");
  } catch (error) {
    res.send("username or password is empty");
  }
};

const login = async (req, res) => {
  res.send("user logind");
};

module.exports = {
  signup,
  login,
};
