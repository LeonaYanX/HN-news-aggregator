// Load required packages and modules
require("express-async-errors");
const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const errorHandler = require("./middleware/errorHandler");
const connectDb = require("./config/db");
const corsOptions = require("./config/cors");
const { schedule } = require("./schedulers/unblockScheduler");

const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const submissionRoutes = require("./routes/submissionRoutes");
const commentsRoutes = require("./routes/commentsRoutes");
const userRoutes = require("./routes/userRoutes");
const searchRoutes = require("./routes/searchRoutes");

const app = express();

// Middleware to parse incoming requests
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors(corsOptions));

/**
 * Connect to MongoDB.
 */
connectDb().catch((err) => {
  console.error("Failed to connect to MongoDB:", err);
  process.exit(1); // Exit the process if connection fails
});

// Register API route handlers
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/submission", submissionRoutes);
app.use("/api/comment", commentsRoutes);
app.use("/api/user", userRoutes);
app.use("/api/search", searchRoutes);

// Global error handling middleware
app.use(errorHandler);

// Start the unblock scheduler (for timed unbans)
schedule();

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
