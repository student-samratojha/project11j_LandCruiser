const mongoose = require("mongoose");
const mongoUri = process.env.MONGO_URI;
async function connectTODb() {
  try {
    await mongoose.connect(mongoUri);
    console.log("connected to mongoDB");
  } catch (err) {
    console.log("error while connect to database", err);
  }
}

module.exports = connectTODb;
