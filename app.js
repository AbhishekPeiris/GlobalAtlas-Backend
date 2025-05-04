// app.js
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const errorHandler = require("./middlewares/error");

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));
app.use(cookieParser());

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/users", require("./routes/users"));
app.use("/api/favourites", require("./routes/favourites"));

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({ message: "Server is healthy!" });
});

// Error handler (keep at end)
app.use(errorHandler);

module.exports = app;
