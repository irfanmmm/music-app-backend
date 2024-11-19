const { MongoClient } = require("mongodb");

const DataBase = async () => {
  const url =
    "mongodb+srv://koyarabigh890:Hv8xKk8W4h7x89f1@cluster0.aothz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
  const dbName = "irfan";
  let client = await MongoClient.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  let db = client.db(dbName);

  return db;
};

module.exports = DataBase;
