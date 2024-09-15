const jwt = require("jsonwebtoken");
const DataBase = require("../../db/db");

const GetSong = async (req, res) => {

    let id = req.query.id
    let token = req.headers.authorization;



    if (Number.isNaN(Number(id))) {
        return res.json({
            status: false,
            message: 'Faild',
            error: 'Id is not valid',
        })
    }

    try {
        const db = await DataBase()

        let validatetoken = jwt.verify(token, 'music-application')
        const user = validatetoken.email

        const create = await db.createCollection('recetplayhistory')
        const collection = await db.collection('recetplayhistory')
        const doc = await collection.findOne({ user: user });

        if (doc) {

            // check max limit of history of song list (20)
            const v = await collection.findOne({ user });

            if (v && v.songs.length >= 20) {
                // Remove the first element of the array
                await collection.updateOne(
                    { user: user },
                    {
                        $pop: {
                            songs: 1 // -1 pops from the beginning of the array
                        }
                    }
                );
            }
            // Check if the song already exists
            const songExists = doc.songs.some(song => song.song === Number(id));

            if (!songExists) {
                // Add the new song with timestamp
                await collection.updateOne(
                    { user: user },
                    {
                        $push: {
                            songs: {
                                song: Number(id),
                                time: Date.now()
                            }
                        }
                    }
                );
            } else {
                await collection.updateOne(
                    { user: user, 'songs.song': Number(id) },
                    {
                        $set: {
                            'songs.$.time': Date.now() // Update the timestamp of the matching song
                        }
                    }

                )
            }
        } else {
            // Document doesn't exist, create it with the new song
            await collection.updateOne(
                { user: user },
                {
                    $set: {
                        songs: [{
                            song: Number(id),
                            time: Date.now()
                        }]
                    }
                },
                { upsert: true }
            );
        }

        const songdetails = await db.collection('allsongs').findOne({ _id: Number(id) })

        res.json({
            status: true,
            message: 'Success',
            data: songdetails,
        })
    } catch (error) {
        res.json({
            status: false,
            message: 'Faild',
            error: error.toString(),
        })
    }
};

module.exports = GetSong;
