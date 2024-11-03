const DataBase = require("../../db/db");
const jwt = require("jsonwebtoken");

const likedSongs = async (req, res) => {
  try {
    let userdetails = jwt.decode(req.headers.authorization);
    if (userdetails) {
      let user = userdetails.email;
      const db = await DataBase();
      const userlikedcolloction = await db
        .collection("likedsongs")
        .findOne({ user });

      const songids = userlikedcolloction.songs;
      console.log(songids, 'songs=================');


      const getallsongs = await db
        .collection("allsongsdetails")
        .find({ _id: { $in: songids } })
        .toArray();

        

      if (getallsongs.length > 0) {
        res.json({
          status: true,
          message: "Success",
          data: getallsongs,
        });
        return;
      } else {
        res.json({
          status: false,
          message: "Liked Songs not found",
        });
        return;
      }
    } else {
      res.json({
        status: false,
        message: "Token Is Not Valid",
      });
      return;
    }
  } catch (error) {
    res.json({
      status: false,
      message: "Token Is Not Valid",
      error: error?.toString(),
    });
  }
};

module.exports = likedSongs;
