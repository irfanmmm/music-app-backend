const DataBase = require("../../db/db");

const songs = async (req, res) => {

  try {

    const db = await DataBase();
    const songlist = await db.collection("songs").find().toArray();

    res.json({
      status: true,
      message: 'Success',
      data: songlist
    });
  } catch (error) {
    res.json({
      status: false,
      message: 'Somthing Went Wrong',
      error: error?.toString()
    });
  }
};

module.exports = songs;
