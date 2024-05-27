const DataBase = require("../../db/db");
const multer = require("multer");
const { GridFsStorage } = require("multer-gridfs-storage");
const path = require("path");

const uploadsongs = async (req, res) => {
  let data = req.file;

  console.log(data);

  res.send(data);

  try {
    let db = await DataBase();
    db.collection("playlists").insertOne({
      data,
    });

    res.send("added");
  } catch (error) {
    res.send(error);
  }
};

module.exports = uploadsongs;
