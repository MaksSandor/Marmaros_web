const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Routes
const toursRoute = require("./routes/tours");
app.use("/tours", toursRoute);

const userRoutes = require('./routes/users');
app.use('/users', userRoutes);

const commentRoutes = require('./routes/comments');
app.use('/api/comments', commentRoutes);

// DB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
