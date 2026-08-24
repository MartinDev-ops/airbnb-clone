const mongoose = require("mongoose");

/**
 * Connects to MongoDB using Mongoose.
 * The connection string comes from the MONGO_URI environment variable
 * (see .env.example). Exits the process if the connection fails so that
 * deployment platforms (e.g. Heroku) surface the failure clearly in logs.
 */
async function connectDB() {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    console.error("MONGO_URI is not set. Add it to your .env file.");
    process.exit(1);
  }

  try {
    mongoose.set("strictQuery", true);
    await mongoose.connect(uri);
    console.log(`MongoDB connected: ${mongoose.connection.host}`);
  } catch (err) {
    console.error(`MongoDB connection error: ${err.message}`);
    process.exit(1);
  }
}

module.exports = connectDB;
