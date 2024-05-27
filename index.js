const express = require("express");
const DataBase = require("./db/db");
const bodyParser = require("body-parser");
const multer = require("multer");
const { signup, login } = require("./api/auth/auth");
const {
  signupuserchecker,
  loginchecker,
} = require("./middleware/authentication");
const playlist = require("./api/main/playlist");
const uploadsongs = require("./api/main/uploadsongs");

const app = express();

app.use(bodyParser.json());

// auth
app.post("/signup", signupuserchecker, signup);
app.post("/login", loginchecker, login);

// create songs
app.use(multer({ dest: "songs" }).single("songs"));
app.post("/uploadsongs", uploadsongs);

// responses
app.get("/playlists", playlist);

app.get("/", async (req, res) => {
  const db = await DataBase();
  const result = await db.collection("user").insertOne({
    name: "irfan",
    class: "41",
  });

  console.log("Data inserted", result.ops);
  res.send("Hello, data inserted!");
});

app.get("/recive", async (req, res) => {
  const db = await DataBase();
  const result = await db.collection("user").find().toArray();
  res.send(result);
});

app.listen(3000, () => {});
