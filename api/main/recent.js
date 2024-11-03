const DataBase = require("../../db/db");
const jwt = require('jsonwebtoken');

const recent = async (req, res) => {
    try {

        let userdetails = jwt.decode(req.headers.authorization)
        if (userdetails) {
            let user = userdetails.email;
            const db = await DataBase();
            const userlikedcolloction = await db.collection("recetplayhistory").findOne({ user })
            const songs = userlikedcolloction.songs.sort((a, b) => b.time - a.time);
            const songIds = songs.map(song => song.song);
            const getallsong = await db.collection('allsongsdetails').find().toArray()

            let data = [];
            for (let i = 0; i < getallsong.length; i++) {
                for (let j = 0; j < songIds.length; j++) {
                    if (getallsong[i]._id === songIds[j]) {
                        data.push(getallsong[i])
                    }

                }

            }


            console.log(data);


            res.json({
                status: true,
                message: 'Success',
                data
            });

        } else {
            res.json({
                status: false,
                message: 'Token Is Not Valid',
            });
        }
    } catch (error) {
        res.json({
            status: false,
            message: 'Token Is Not Valid',
            error: error?.toString()
        });
    }
};

module.exports = recent;
