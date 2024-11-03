const DataBase = require("../../db/db");

const GetallSongDeatils = async (req, res) => {
  console.log(req.body);
  let page = Number(req.body.count) || 1;
  let pageSize = Number(req.body.pageSize) || 10;

  try {
    const db = await DataBase();
    const songdetailsCollection = await db.collection("allsongsdetails");

    // fetch total count
    const totalCount = await songdetailsCollection.countDocuments();

    // Fetch the documents for the current page
    const songdetails = await songdetailsCollection
      .find()
      .skip((page - 1) * pageSize) // Skip the documents of previous pages
      .limit(pageSize) // Limit to the number of documents per page
      .toArray();

    res.json({
      status: true,
      message: "Success",
      data: songdetails,
      pagination: {
        totalCount,
        page,
        pageSize,
        totalPages: Math.ceil(totalCount / pageSize),
      },
    });
  } catch (error) {
    res.json({
      status: false,
      message: "Faild",
      error: error.toString(),
    });
  }
};

module.exports = GetallSongDeatils;
