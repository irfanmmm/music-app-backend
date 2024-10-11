const DataBase = require("../../db/db");
const Vibrant = require("node-vibrant");
const tinycolor = require("tinycolor2");
const fs = require("fs");
const mm = require("music-metadata");
const path = require("path");
const { Buffer } = require("buffer");

async function extractDarkColorsFromImage(url) {
  try {
    const palette = await Vibrant.from(url).getPalette();
    const swatches = Object.values(palette).filter((swatch) => swatch);
    swatches.sort((a, b) => b.getPopulation() - a.getPopulation());
    const dominantColors = swatches.slice(0, 2).map((swatch) => {
      const hex = swatch.getHex();

      const darkColor = tinycolor(hex).darken(30).toHexString();
      return darkColor;
    });

    return dominantColors?.reverse();
  } catch (err) {
    return [];
  }
}

const getSongMetadata = async (song) => {
  try {
    const v = await mm.loadMusicMetadata();
    const metadata = await v.parseFile(song);
    console.log(metadata.common.title, "picture");

    const imageName =
      Date.now() + "." + metadata.common.picture[0]?.format.split("/")[1];

    const imagePath = path.resolve(
      __dirname,
      "../../uploads/images",
      imageName
    );
    const buffer = Buffer.from(metadata.common.picture[0]?.data);

    fs.writeFile(imagePath, buffer, (err) => {
      if (err) {
        console.error("Error saving image:", err);
      } else {
        console.log("Image saved successfully at:", imagePath);
      }
    });

    return {
      title: metadata.common.title,
      artist: metadata.common.artist,
      image: "/uploads/images/" + imageName,
    };
  } catch (error) {
    console.log(error?.message);
  }
};

const uploadsongs = async (req, res) => {
  const hostname = req.headers.host;
  let song = req.files?.song[0];

  if (!song) {
    res.status(404).json({
      status: false,
      error: "No song found",
    });
  }

  const uniqueId = Date.now();

  const pathofsong = `/uploads/songs/${song.filename}`;
  const pathsong = path.resolve(
    __dirname,
    "../../uploads/songs",
    song.filename
  );

  const metadata = await getSongMetadata(pathsong);

  if (metadata?.image) {
    var dominent_colors = await extractDarkColorsFromImage(
      "http://" + hostname + metadata?.image
    );
  }

  try {
    const db = await DataBase();
    await db.collection("allsongsdetails").insertOne({
      title: metadata.title,
      artist: metadata.artist,
      _id: uniqueId,
      artwork: metadata.image,
      url: pathofsong,
      colors: dominent_colors,
      like: 0,
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
