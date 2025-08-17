const express = require("express");
const router = express.Router();
const Tour = require("../models/Tour");

// ---- helper ----
const isGalleryPath = (p) => typeof p === "string" && p.startsWith("/uploads/gallery/");

// ===== GALlERY (one flat array) =====

// GET /tours/:id/gallery  -> get gallery
router.get("/:id/gallery", async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id).select("Gallery");
    if (!tour) return res.status(404).json({ error: "Tour not found" });
    res.status(200).json({ gallery: tour.Gallery || [] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /tours/:id/gallery  -> add photo
router.post("/:id/gallery", async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    if (!tour) return res.status(404).json({ error: "Tour not found" });

    const { imageUrl } = req.body;
    if (!isGalleryPath(imageUrl)) {
      return res.status(400).json({ error: "imageUrl must start with /uploads/gallery/" });
    }

    tour.Gallery = Array.isArray(tour.Gallery) ? tour.Gallery : [];
    tour.Gallery.push(imageUrl);
    await tour.save();

    res.status(201).json({ message: "Фото додано", gallery: tour.Gallery });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /tours/:id/gallery?imageUrl=...  -> remove photo
router.delete("/:id/gallery", async (req, res) => {
  try {
    const { imageUrl } = req.query; // використовуємо query, не body
    if (!imageUrl) return res.status(400).json({ error: "imageUrl is required" });

    const tour = await Tour.findById(req.params.id);
    if (!tour) return res.status(404).json({ error: "Tour not found" });

    tour.Gallery = (tour.Gallery || []).filter((url) => url !== imageUrl);
    await tour.save();

    res.status(200).json({ message: "Фото видалено", gallery: tour.Gallery });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===== TOURS LIST/FILTER =====

// GET /tours
router.get("/", async (req, res) => {
  try {
    const { new: isNew, special, discount } = req.query;

    // тільки зі знижкою
    if (discount === "true") {
      const discountedTours = await Tour.aggregate([
        { $match: { $expr: { $gt: ["$old_price", "$price"] } } }
      ]);
      return res.json(discountedTours);
    }

    // без знижки — фільтри
    const filter = {};
    if (isNew === "true") filter.new = true;
    if (special) filter.special = special;

    const tours = await Tour.find(filter);
    res.json(tours);
  } catch (err) {
    console.error("❌ Error fetching tours:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ===== COMMENTS =====

// POST /tours/:id/comments
router.post("/:id/comments", async (req, res) => {
  try {
    const { userId, text } = req.body;
    const tour = await Tour.findById(req.params.id);
    if (!tour) return res.status(404).json({ error: "Тур не знайдено" });

    tour.comments.push({ user: userId, text });
    await tour.save();

    res.status(201).json({ message: "Коментар додано", comments: tour.comments });
  } catch (err) {
    console.error("❌ Помилка:", err);
    res.status(500).json({ error: "Помилка сервера" });
  }
});

// GET /tours/:id
router.get("/:id", async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id)
      .populate("comments.user", "PIB gmail");
    if (!tour) return res.status(404).json({ error: "Тур не знайдено" });
    res.json(tour);
  } catch (err) {
    res.status(500).json({ error: "Помилка сервера" });
  }
});

module.exports = router;

