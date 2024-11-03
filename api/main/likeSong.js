const jwt = require("jsonwebtoken");
const DataBase = require("../../db/db");

const likeSong = async (ws, res) => {
  let token = req.headers.authorization;
  let id = req.body.id;
  let like = req.body.like;
  try {
    const db = await DataBase();

    let validatetoken = jwt.verify(token, "music-application");

    const likemethode = like
      ? { $addToSet: { songs: Number(id) } }
      : {
          $pull: {
            songs: Number(id),
          },
        };

    const likedsongcollection = await db.collection("likedsongs").updateOne(
      { user: validatetoken.email }, // Filter by user email
      likemethode, // Push the single song ID to the songs array
      { upsert: true } // Create the document if it doesn't exist
    );

    const incrementValue = like ? 1 : -1;
    const songdetails = await db.collection("allsongsdetails").updateOne(
      { _id: Number(id) }, // Assuming 'id' is the unique identifier for the song
      { $inc: { like: incrementValue } } // Increment or decrement the 'like' field
    );

    res.json({
      status: true,
      message: "Success",
    });
  } catch (error) {
    res.json({
      status: false,
      message: "Faild",
      error: error.toString(),
    });
  }
};

module.exports = likeSong;
