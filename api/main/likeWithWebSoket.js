const url = require("url");
const jwt = require("jsonwebtoken");
const DataBase = require("../../db/db");

const likeSongwithSoket = (ws, req) => {
  const parameters = url.parse(req.url, true);
  const token = parameters.query.token; // Extract the token
  console.log(token, "validated");

  if (!token) {
    // If token is missing or invalid, close the connection
    ws.close();
    return;
  }

  // When receiving a message from the client
  ws.on("message", async (message) => {
    if (message?.toString()?.split("=")[0] !== "like") {
      // aleready liked to passing intiol value
      let id = message?.toString()?.split("=")[1];

      try {
        const db = await DataBase();
        let validatetoken = jwt.verify(token, "music-application");
        const initiol = await db.collection("likedsongs").findOne(
          { user: validatetoken.email },
          {
            _id: id,
          }
        );

        const filter = initiol?.songs?.filter((item) => item == id)[0];

        if (filter) {
          ws.send(`id=${filter}&like=${true}`);
        } else {
          ws.send(`id=${filter}&like=${false}`);
        }
      } catch (error) {
        ws.send(error.toString());
      }
    } else {
      let id = message.toString().split("&")[1].split("=")[1];
      let like = JSON.parse(message.toString().split("=")[1].split("&")[0]);
      console.log(id);
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
        console.log(like);
        ws.send(`liked=${like}&id=${id}`);
      } catch (error) {
        ws.send(error.toString());
      }
    }
  });

  ws.on("close", () => {
    console.log("WebSocket connection closed");
  });
};

module.exports = likeSongwithSoket;
