const http = require("http");
const WebSocket = require("ws");
const path = require("path");
const cors = require("cors");
const express = require("express");
const bodyParser = require("body-parser");
const { signup } = require("./api/auth/auth");
const uploadsongs = require("./api/main/uploadsongs");
const userdetails = require("./api/main/userdetails");
const AuthCheck = require("./api/main/authchack");
const likedSongs = require("./api/main/likedSongs");
const recent = require("./api/main/recent");
const upload = require("./middleware/fileupload");
const GetallSongDeatils = require("./api/main/getallsongdeatils");
const GetSong = require("./api/main/getSong");
const likeSong = require("./api/main/likeSong");
const likeSongwithSoket = require("./api/main/likeWithWebSoket");
const health = require("./api/main/health");
const notification = require("./api/main/notifications");

const app = express();
const server = http.createServer(app); // Create the HTTP server
const wss = new WebSocket.Server({ server });

app.use(express.static(path.join(__dirname, "public")));

// test
app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "public/templates/", "index.html"));
});

app.use(bodyParser.json());

const corsOptions = {
  origin: "http://10.25.25.104:3000", // Replace with the origin you want to allow
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: "Content-Type,Authorization",
};

app.post("/send-notification", notification);
app.use(cors(corsOptions));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// auth
app.get("/health", health);

app.post("/signup", signup);

// create songs
app.use(upload);
app.post("/uploadsongs", uploadsongs);

// get All songs
app.post("/getallsongdeatils", GetallSongDeatils);
app.get("/getsong", GetSong);

app.use(AuthCheck);
app.get("/userdetails", userdetails);

// like a song
app.post("/like", likeSong);
app.get("/likedsongs", likedSongs);

wss.on("connection", likeSongwithSoket);
// get recent play song list
app.get("/recent", recent);

// notification service

app.use("/notification", notification);

server.listen(3000, () => {});

// v.v = 'xcvxcvxcv'
