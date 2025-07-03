const mongoose = require("mongoose");

const tourSchema = new mongoose.Schema({
  name: String,
  img: String,
  price: Number,
  freePlaces: Number,
  maxPlaces: Number
});

module.exports = mongoose.model("Tour", tourSchema);
