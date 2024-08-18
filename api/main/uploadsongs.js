const DataBase = require("../../db/db");
const multer = require("multer");
const path = require("path");
const os = require('os')

const getLocalIpAddress = () => {
  const interfaces = os.networkInterfaces();
  for (const interfaceName in interfaces) {
    for (const iface of interfaces[interfaceName]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return null;
};

const uploadsongs = async (req, res) => {
  let name = req.body.name;
  let image = req.files.image[0];
  let song = req.files.song[0];

  if (!name || !image || !song) {
    return res.json({
      status: false,
      message: 'Please fill the form',
    });
  }

  const uniqueId = Date.now()

  console.log(getLocalIpAddress());
  

  const pathofimage = `${req.protocol}://${getLocalIpAddress()}:3000/uploads/images/${image.filename}`
  const pathofsong = `${req.protocol}://${getLocalIpAddress()}:3000/uploads/songs/${song.filename}`

  try {
    const db = await DataBase()
    const allsongsdetails = await db.collection("allsongsdetails").insertOne({
      title: name,
      _id: uniqueId,
      thumbnail: pathofimage,
      song: pathofsong,
    })
    
    res.json({
      status: true,
      message: 'Success',
    });


  } catch (error) {
    res.json({
      status: false,
      message: 'Somthing Went Wrong',
      error: error.toString()
    });
  }



  // try {
  //   let db = await DataBase();
  //   db.collection("playlists").insertOne({
  //     data,
  //   });

  //   res.send("added");
  // } catch (error) {
  //   res.send(error);
  // }
};

module.exports = uploadsongs;
