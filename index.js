const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/users", require("./routes/users"));
app.use("/api/favourites", require("./routes/favourites"));

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({ message: "Server is healthy!" });
});

app.get("/", (req, res) => {
  res.send("Server is running!");
});

//health check route
app.get("/health", (req, res) => {
  res.status(200).json({ message: "Server is healthy!" });
});

// Only connect to DB & start server if not in test mode
if (process.env.NODE_ENV !== "test") {
  require("./config/db"); // Load database connection

  const PORT = process.env.PORT;
  app.listen(PORT, () => {
    console.log(`Server is running on: http://localhost:${PORT}`);
  });
}

module.exports = app;
