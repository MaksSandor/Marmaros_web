const mongoose = require("mongoose");

const tourSchema = new mongoose.Schema({
  id: Number,
  name: String,
  img: String,
  mp4: String,
  price: Number,
  old_price: Number, // ✅ нове поле
  freePlaces: Number,
  maxPlaces: Number,
  about: String,
  special: {
    type: String,       // "5days", "excursion", "ski", "newYear", "festive"
    enum: ["5days", "excursion", "ski", "newYear", "festive"]
  },
  new: Boolean // ✅ нове поле
});

module.exports = mongoose.model("Tour", tourSchema);

