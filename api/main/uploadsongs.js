const DataBase = require("../../db/db");
const Vibrant = require("node-vibrant");
const multer = require("multer");
const path = require("path");
const os = require("os");

async function extractColorsFromImage(url) {
  console.log("Dominant Colors:", url);
  try {
    // Download the image locally (Vibrant works with local files)

    // Extract the color palette from the image
    const palette = await Vibrant.from(url).getPalette();

    // Sorting the swatches by population (dominance)
    const swatches = Object.values(palette).filter((swatch) => swatch); // Ensure non-null swatches
    swatches.sort((a, b) => b.getPopulation() - a.getPopulation());

    // Get the top 2 dominant colors
    const dominantColors = swatches
      .slice(0, 2)
      .map((swatch) => swatch.getHex());
    return dominantColors;
  } catch (err) {
    console.error("Error extracting colors:", err);
  }
}

const getLocalIpAddress = () => {
  const interfaces = os.networkInterfaces();
  for (const interfaceName in interfaces) {
    for (const iface of interfaces[interfaceName]) {
      if (iface.family === "IPv4" && !iface.internal) {
        return iface.address;
      }
    }
  }
  return null;
};

const uploadsongs = async (req, res) => {
  let name = req.body.name;
  let artist = req.body.artist;
  let image = req.files;
  console.log(req);
  
  let song = req.file;

  if (!name || !image || !song || !artist) {
    return res.json({
      status: false,
      message: "Please fill the form",
    });
  }

  const uniqueId = Date.now();

  const pathofimage = `${
    req.protocol
  }://${getLocalIpAddress()}:3000/uploads/images/${image.filename}`;
  const pathofsong = `${
    req.protocol
  }://${getLocalIpAddress()}:3000/uploads/songs/${song.filename}`;
  const dominent_colors = await extractColorsFromImage(pathofimage);

  try {
    const db = await DataBase();
    const allsongsdetails = await db.collection("allsongsdetails").insertOne({
      title: name,
      artist: artist,
      _id: uniqueId,
      artwork: pathofimage,
      url: pathofsong,
      colors: dominent_colors,
    });

    res.json({
      status: true,
      message: "Success",
    });
  } catch (error) {
    res.json({
      status: false,
      message: "Somthing Went Wrong",
      error: error.toString(),
    });
  }
};

module.exports = uploadsongs;
