const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  text: String,
  createdAt: { type: Date, default: Date.now },
});

// 🔸 Альбом (окремий масив фото)
const galleryAlbumSchema = new mongoose.Schema({
  title: { type: String, required: true },       // назва альбому: "День 1", "Зима", "SPA" тощо
  photos: [{ type: String, required: true }],    // шляхи типу "/uploads/gallery/xxx.jpg"
}, { _id: true }); // залишаємо _id, щоб зручно посилатися в маршрутах

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
  special: { type: String, enum: ["5days", "excursion", "ski", "newYear", "festive"] },
  date: { firstDay: String, lastDay: String, countDays: Number },
  locate: String,
  food: String,
  startPlace: String,
  program: String,
  addedPay: String,
  Hotel: String,
  keyWords: [String],
  anotherInf: String,

  // 🖼️ Старе поле (якщо було): Gallery: [String]
  // 🔸 НОВЕ: масив альбомів
  galleries: [galleryAlbumSchema],

  comments: [commentSchema],
}, { timestamps: true });

module.exports = mongoose.model("Tour", tourSchema);
