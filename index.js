const path = require('path')
const cors = require('cors');
const express = require("express");
const DataBase = require("./db/db");
const bodyParser = require("body-parser");
const multer = require("multer");
const { signup } = require("./api/auth/auth");
const uploadsongs = require("./api/main/uploadsongs");
const userdetails = require("./api/main/userdetails");
const AuthCheck = require("./api/main/authchack");
const likedSongs = require('./api/main/likedSongs');
const recent = require('./api/main/recent');
const upload = require('./middleware/fileupload');
const GetallSongDeatils = require('./api/main/getallsongdeatils');
const GetSong = require('./api/main/getSong');
const likeSong = require('./api/main/likeSong');

const app = express();
app.use(bodyParser.json());
app.use('/uploads/images', express.static(path.join(__dirname, 'uploads', 'images')));
app.use('/uploads/songs', express.static(path.join(__dirname, 'uploads', 'songs'), {
  setHeaders: (res, path) => {
    if (path.endsWith('.mp3')) {
      console.log('Setting MIME type for:', path);
      res.setHeader('Content-Type', 'audio/mpeg');
    }
  }
}));

const corsOptions = {
  origin: 'http://192.168.43.179:3000', // Replace with the origin you want to allow
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: 'Content-Type,Authorization',
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
app.get('/likedsongs', likedSongs)

// get recent play song list
app.get('/recent', recent)


app.listen(3000, () => { });
