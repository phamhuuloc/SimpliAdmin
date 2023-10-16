// var mongoClient = require("mongodb").MongoClient;
var Connection = require("mongoose");
const connectDB = async () => {
  try {
    const conn = await Connection.connect(process.env.MONGODB_URI);
    console.log(`🟢🟢🟢 Database Connected`);
  } catch (error) {
    console.log(`🔴🔴🔴 Database Connection Error: ${error}`);
  }
};

module.exports = connectDB;
