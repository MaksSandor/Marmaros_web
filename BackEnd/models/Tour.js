const mongoose = require("mongoose");

const tourSchema = new mongoose.Schema({
  name: String,
  img: String,
  price: Number,
  freePlaces: Number,
  maxPlaces: Number,
  about:String,
  mp4: String // 🆕 нове поле для відео
});

module.exports = mongoose.model("Tour", tourSchema);

