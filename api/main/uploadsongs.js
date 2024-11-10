const DataBase = require("../../db/db");
const Vibrant = require("node-vibrant");
const tinycolor = require("tinycolor2");
const fs = require("fs");
const https = require("https");
const mm = require("music-metadata");
const path = require("path");
const { Buffer } = require("buffer");
const {
  getFileUrl,
  uploadImageFile,
  getsingleFileUrl,
  onDeleteToDrive,
} = require("../../googledrive/auth");
const { SONG_DIR } = require("../../googledrive/filepath");
const { Readable } = require("stream");

async function extractDarkColorsFromImage(buffer) {
  try {
    const palette = await Vibrant.from(buffer).getPalette();
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

const getSongMetadata = async (song, songId) => {
  // try {
  return new Promise(async (resolve, reject) => {
    const uniqueId = Date.now();
    const db = await DataBase();
    fetch(song)
      .then(async (res) => {
        try {
          const songpath = res.body;
          const v = await mm.loadMusicMetadata();
          const bufferStream = new Readable();
          const metadata = await v.parseWebStream(songpath, "audio/mpeg");
          const existingSong = await db
            .collection("allsongsdetails")
            .find({
              title: metadata.common.title,
            })
            .toArray();
          console.log(existingSong);

          if (existingSong && existingSong.length > 0) {
            await onDeleteToDrive(songId);
            await db.collection("allsongsdetails").deleteOne({
              url: song,
            });
            return reject("Duplicate Song Deleted");
          } else {
            if (metadata.common.picture.length === 0) {
              await onDeleteToDrive(songId);
              return reject("Meta Data not getting");
            }
            const imageName =
              uniqueId +
                "." +
                metadata.common.picture[0]?.format.split("/")[1] || "png";
            const buffer = Buffer.from(metadata.common.picture[0]?.data);
            var dominent_colors = await extractDarkColorsFromImage(buffer);
            bufferStream.push(buffer);
            bufferStream.push(null);
            const reponse = await uploadImageFile(imageName, bufferStream);
            const imageurl = await getsingleFileUrl(reponse.id);
            resolve({
              _id: uniqueId,
              title: metadata?.common?.title,
              artist: metadata?.common?.artist,
              artwork: imageurl?.webContentLink,
              driveSongId: songId,
              url: song,
              colors: dominent_colors,
              like: 0,
            });
          }
        } catch (error) {
          reject("Meta Data not getting Error:", error);
        }
      })
      .catch((error) => {
        reject("Network Error:", error);
      });
  });
};

const uploadsongs = async (req, res) => {
  try {
    const fileId = SONG_DIR;
    let allsongs = await getFileUrl(fileId);

    if (!allsongs.files || allsongs.files.length === 0) {
      return res.status(404).json({
        status: false,
        error: "No song found",
      });
    }
    const db = await DataBase();

    for (const pathofsong of allsongs.files) {
      try {
        const metadata = await getSongMetadata(
          pathofsong.webContentLink,
          pathofsong.id
        );

        await db.collection("allsongsdetails").insertOne({
          ...metadata,
        });
      } catch (error) {
        console.log(error);
        continue;
      }
    }

    res.json({
      status: true,
      message: "Success",
      data: {
        allsongs,
      },
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
