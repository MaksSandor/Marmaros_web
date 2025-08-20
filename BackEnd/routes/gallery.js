const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();

// шлях до папки maingallery
const galleryPath = path.join(__dirname, "../uploads/gallery/maingallery");

// Отримати список картинок
router.get("/maingallery", (req, res) => {
  fs.readdir(galleryPath, (err, files) => {
    if (err) {
      return res.status(500).json({ error: "Помилка при зчитуванні галереї" });
    }

    // Формуємо URL-и
    const images = files.map(file => `/uploads/gallery/maingallery/${file}`);
    res.json(images);
  });
});

module.exports = router;
