const jwt = require("jsonwebtoken");
const DataBase = require("../../db/db");

const GetallSongDeatils = async (req, res) => {
    try {

        const db = await DataBase()
        const songdetails = await db.collection('allsongsdetails').find().toArray()

        console.log(songdetails);
        

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

module.exports = GetallSongDeatils;
