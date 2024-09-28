const DataBase = require("../../db/db");
const Vibrant = require("node-vibrant");
const multer = require("multer");
const path = require("path");
const os = require("os");
const tinycolor = require("tinycolor2");

async function extractDarkColorsFromImage(url) {
  console.log("Extracting Dark Dominant Colors from:", url);
  try {
    // Extract the color palette from the image
    const palette = await Vibrant.from(url).getPalette();

    // Sorting the swatches by population (dominance)
    const swatches = Object.values(palette).filter((swatch) => swatch); // Ensure non-null swatches
    swatches.sort((a, b) => b.getPopulation() - a.getPopulation());

    // Get the top 2 dominant colors
    const dominantColors = swatches.slice(0, 2).map((swatch) => {
      const hex = swatch.getHex();

      // Darken the color using tinycolor2
      const darkColor = tinycolor(hex).darken(30).toHexString(); // Darken by 30% (adjust as needed)
      return darkColor;
    });

    console.log(dominantColors, "this is dominant colors -------------");

    return dominantColors?.reverse();
  } catch (err) {
    console.error("Error extracting colors:", err);
    return [];
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
  let image = req.files?.image[0];
  let song = req.files?.song[0];

  console.log(song);

  console.log(song);
  if (!image || !song || !artist) {
    return res.json({
      status: false,
      message: "Please fill the form",
    });
  }

  const uniqueId = Date.now();

  const pathofimage = `/uploads/images/${image.filename}`;
  const pathofsong = `/uploads/songs/${song.filename}`;
  const dominent_colors = await extractDarkColorsFromImage(pathofimage);

  try {
    const db = await DataBase();
    const allsongsdetails = await db.collection("allsongsdetails").insertOne({
      title: name ?? song?.originalname,
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
