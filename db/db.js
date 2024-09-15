const { MongoClient } = require("mongodb");

const DataBase = async () => {
  const url = "mongodb+srv://mm86002747:SoWR7kCYvCHxWudw@cluster0.7cxvf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
  const dbName = "irfan";
  let client = await MongoClient.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  let db = client.db(dbName);

  return db;
};

module.exports = DataBase;
