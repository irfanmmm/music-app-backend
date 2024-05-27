const DataBase = require("../../db/db");

const playlist = async (req, res) => {
  const db = await DataBase();
  db.collection("playlists").find().toArray();

  res.send("user logind");
};

module.exports = playlist;
