const DataBase = require("../../db/db");
const Vibrant = require("node-vibrant");
const tinycolor = require("tinycolor2");
const mm = require("music-metadata-browser");
const { Buffer } = require("buffer");
const {
  getFileUrl,
  uploadImageFile,
  getsingleFileUrl,
  onDeleteToDrive,
} = require("../../googledrive/auth");
const { SONG_DIR } = require("../../googledrive/filepath");
const { Readable } = require("stream");
const NotificationSercvice = require("../../farebase/NotificationService");

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
  return new Promise(async (resolve, reject) => {
    const uniqueId = Date.now();
    const db = await (await DataBase()).collection("allsongsdetails");
    fetch(song)
      .then(async (res) => {
        try {
          const songpath = res.body;
          const metadata = await mm.parseReadableStream(songpath, "audio/mpeg");
          const existingSong = await db
            .find({
              title: metadata.common.title,
            })
            .toArray();
          if (existingSong && existingSong.length > 0) {
            return reject("Duplicate Song");
          } else {
            if (metadata.common.picture.length === 0) {
              await onDeleteToDrive(songId);
              await db.deleteOne({
                url: song,
              });
              return reject("Meta Data not getting");
            }
            const imageName =
              uniqueId +
                "." +
                metadata.common.picture[0]?.format.split("/")[1] || "png";
            const buffer = Buffer.from(metadata.common.picture[0]?.data);
            var dominent_colors = await extractDarkColorsFromImage(buffer);
            const bufferStream = new Readable();
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
          console.log(error.message);
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
    const db = await (await DataBase()).collection("allsongsdetails");
    const userCollection = await (await DataBase()).collection("users");
    let newSongList = [];

    for (const pathofsong of allsongs.files) {
      try {
        const metadata = await getSongMetadata(
          pathofsong.webContentLink,
          pathofsong.id
        );

        if (metadata) {
          await db.insertOne({
            ...metadata,
          });
        }
        newSongList.push(metadata);
        console.log(newSongList.length + " Song Uploded");
      } catch (error) {
        console.log(error);
        continue;
      }
    }
    // send notification
    const users = await userCollection.find().toArray();

    for (const user of users) {
      console.log(user.notificationid);
      if (!user.notificationid) continue;
      const title = "New songs";
      const body = `New ${newSongList.length} Songs Added for Youer Playlist`;
      await NotificationSercvice.sendNotification(
        user.notificationid,
        title,
        body
      );
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
