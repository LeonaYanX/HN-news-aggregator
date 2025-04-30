/**
 * @fileoverview MongoDB connection utility.
 */

const mongoose = require("mongoose");

/**
 * Establishes a connection to MongoDB using the URI from environment variables.
 *
 * @async
 * @function connectDb
 * @returns {Promise<void>} Resolves when the connection is successfully established.
 * @throws Will terminate the process if the connection fails.
 */
const connectDb = async () => {
  try {
    // Attempt to connect using the MONGO_URI environment variable
    await mongoose.connect(process.env.MONGO_URI);
    console.log("DB connected successfully.");
  } catch (err) {
    // Log the error and exit the process with failure code
    console.error("DB connection failed:", err);
    process.exit(1);
  }
};

module.exports = connectDb;
