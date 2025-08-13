const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  lastName: { type: String, required: true },        // Прізвище
  firstName: { type: String, required: true },       // Ім'я
  middleName: { type: String },                      // По батькові

  age: { type: Number },                             // Вік
  gender: { type: String, enum: ["male", "female", "other"] }, // Стать

  isRegular: { type: Boolean, default: false },      // Постійний клієнт
  tripsCount: { type: Number, default: 0 },          // К-сть поїздок

  phoneNumber: { type: String, required: true },     // Номер телефону
  isVerified: { type: Boolean, default: false },     // Підтверджена

  email: { type: String, required: true, unique: true }, // Емейл

  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }] // Масив коментарів
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);

