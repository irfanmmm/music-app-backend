const { MongoClient } = require("mongodb");

const DataBase = async () => {
  const url = "mongodb://localhost:27017";
  const dbName = "irfan";
  let client = await MongoClient.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  let db = client.db(dbName);

  return db;
};

module.exports = DataBase;
