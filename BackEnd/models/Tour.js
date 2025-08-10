const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  text: String,
  createdAt: { type: Date, default: Date.now },
});

const tourSchema = new mongoose.Schema({
  name: { type: String, required: true },
  img: { type: String },
  mp4: { type: String },
  price: { type: Number, required: true },
  old_price: { type: Number },
  freePlaces: { type: Number },
  maxPlaces: { type: Number },
  about: { type: String },
  new: { type: Boolean, default: false },
  special: {
    type: String,
    enum: ["5days", "excursion", "ski", "newYear", "festive"]
  },
  date: {
    firstDay: String,
    lastDay: String,
    countDays: Number
  },
  locate: String,
  food: String,
  startPlace: String,
  program: String,
  addedPay: String,
  Hotel: String,
  keyWords: [String],
  anotherInf: String,

  // 🖼️ Галерея фото
  Gallery: [String], // масив URL-ів

  // 💬 Коментарі
  comments: [commentSchema],
}, { timestamps: true });

module.exports = mongoose.model("Tour", tourSchema);
