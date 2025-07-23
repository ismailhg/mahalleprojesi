const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();

// Middleware'ler
app.use(cors());
app.use(express.json());

// Routes
const locationRoutes = require("./routes/locationRoutes");
app.use("/api/location", locationRoutes);

const commentsRoutes = require("./routes/commentsRoutes");
app.use("/api/comments", commentsRoutes);

const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

// Buraya userRoutes ekle
const userRoutes = require("./routes/userRoutes");
app.use("/api/user", userRoutes);

// Test endpoint
app.get("/", (req, res) => {
  res.send("API çalışıyor!");
});

// Sunucu başlat
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server çalışıyor: http://localhost:${PORT}`);
});
