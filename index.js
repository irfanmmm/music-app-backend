const http = require("http");
const WebSocket = require("ws");
const path = require("path");
const cors = require("cors");
const express = require("express");
const DataBase = require("./db/db");
const bodyParser = require("body-parser");
const multer = require("multer");
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
const url = require("url");
const jwt = require("jsonwebtoken");
const likeSongwithSoket = require("./api/main/likeWithWebSoket");

const app = express();
const server = http.createServer(app); // Create the HTTP server
const wss = new WebSocket.Server({ server });

app.use(bodyParser.json());
app.use(
  "/uploads/images",
  express.static(path.join(__dirname, "uploads", "images"))
);
app.use(
  "/uploads/songs",
  express.static(path.join(__dirname, "uploads", "songs"), {
    setHeaders: (res, path) => {
      if (path.endsWith(".mp3")) {
        console.log("Setting MIME type for:", path);
        res.setHeader("Content-Type", "audio/mpeg");
      }
    },
  })
);

const corsOptions = {
  origin: "http://192.168.43.179:3000", // Replace with the origin you want to allow
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: "Content-Type,Authorization",
};

app.use(cors(corsOptions));

// auth
app.post("/signup", signup);

// create songs
app.use(upload);
// app.use(upload.single("song"));
app.post("/uploadsongs", uploadsongs);

// responses
app.get("/userdetails", userdetails);

// app.use(AuthCheck)
// get All songs
app.get("/getallsongdeatils", GetallSongDeatils);
app.get("/getsong", GetSong);

// like a song
app.post("/like", likeSong);
app.get("/likedsongs", likedSongs);

wss.on("connection", likeSongwithSoket);

// wss.on("connection", (ws, req) => {
//   const parameters = url.parse(req.url, true);
//   const token = parameters.query.token; // Extract the token

//   if (!token || token !== "your_expected_token") {
//     // If token is missing or invalid, close the connection
//     ws.close();
//     return;
//   }

//   let validatetoken = jwt.verify(token, "music-application");
//   if (validatetoken) {
//   }

//   // When receiving a message from the client
//   ws.on("message", (message) => {
//     console.log("Received", message);
//     wss.clients.forEach((client) => {
//       if (client.readyState === WebSocket.OPEN) {
//         client.send(message.toString()); // You can send any data, e.g., JSON.stringify(data)
//       }
//     });
//   });

//   ws.on("close", () => {
//     console.log("WebSocket connection closed");
//   });
// });

// get recent play song list
app.get("/recent", recent);

server.listen(3000, () => {});
