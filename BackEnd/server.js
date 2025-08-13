const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();

// ===== Middleware
app.use(cors()); // за потреби: cors({ origin: "http://localhost:3000", credentials: true })
app.use(express.json({ limit: "1mb" }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ===== Routes
const toursRoute = require("./routes/tours");
app.use("/tours", toursRoute);

const userRoutes = require("./routes/users");
app.use("/users", userRoutes);

const commentRoutes = require("./routes/comments");
app.use("/api/comments", commentRoutes);

// ✅ ПІДКЛЮЧАЄМО ПІДТВЕРДЖЕННЯ ТЕЛЕФОНУ ДО listen
const phoneVerifyRoutes = require("./routes/phoneVerify");
app.use("/phone", phoneVerifyRoutes);

// ===== DB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ Mongo error:", err));

// ===== Start
const PORT = process.env.PORT || 3001;
app.get("/ping", (req, res) => res.send("pong"));
app.listen(PORT, () => console.log(`🚀 API on http://localhost:${PORT}`));
