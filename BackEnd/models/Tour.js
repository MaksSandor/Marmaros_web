const mongoose = require("mongoose");

// Схема для коментарів
const commentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  text: String,
  createdAt: { type: Date, default: Date.now },
});

// Схема для турів
const tourSchema = new mongoose.Schema({
  id: Number, // Якщо потрібно власне ID (не _id)
  name: { type: String, required: true },
  img: { type: String }, // Головне фото
  mp4: { type: String }, // Відео
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
    firstDay: { type: String },
    lastDay: { type: String },
    countDays: { type: Number }
  },

  locate: { type: String },
  food: { type: String },
  startPlace: { type: String },
  program: { type: String },
  addedPay: { type: String },
  Hotel: { type: String },
  keyWords: [{ type: String }],
  anotherInf: { type: String },
  Gallery: [{ type: String }],

  comments: [commentSchema], // масив коментарів
},
{ timestamps: true }
);

module.exports = mongoose.model("Tour", tourSchema);
