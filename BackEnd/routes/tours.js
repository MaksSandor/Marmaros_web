const express = require("express");
const router = express.Router();
const Tour = require("../models/Tour");

router.get("/", async (req, res) => {
  try {
    const { new: isNew, special, discount } = req.query;

    // Якщо хочемо лише зі знижкою — через aggregate
    if (discount === "true") {
      const discountedTours = await Tour.aggregate([
        {
          $match: {
            $expr: { $gt: ["$old_price", "$price"] }
          }
        }
      ]);
      return res.json(discountedTours);
    }

    // Якщо без знижки — звичайний фільтр
    const filter = {};

    if (isNew === "true") {
      filter.new = true;
    }

    if (special) {
      filter.special = special;
    }
    if (req.query.special) {
  filter.special = req.query.special;
}


    const tours = await Tour.find(filter);
    res.json(tours);

  } catch (err) {
    console.error("❌ Error fetching tours:", err);
    res.status(500).json({ error: "Server error" });
  }
});
// POST /tours/:id/comments
router.post("/:id/comments", async (req, res) => {
  try {
    console.log("👉 Отримано ID туру:", req.params.id); // додай це
    const { userId, text } = req.body;

    const tour = await Tour.findById(req.params.id);
    if (!tour) {
      console.log("❌ Тур не знайдено!");
      return res.status(404).json({ error: "Тур не знайдено" });
    }

    tour.comments.push({ user: userId, text });
    await tour.save();

    res.status(201).json({ message: "Коментар додано", comments: tour.comments });
  } catch (err) {
    console.error("❌ Помилка:", err);
    res.status(500).json({ error: "Помилка сервера" });
  }
});

// GET one tour with populated comments
router.get("/:id", async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id)
      .populate("comments.user", "PIB gmail"); // ПІБ та email користувача

    if (!tour) return res.status(404).json({ error: "Тур не знайдено" });

    res.json(tour);
  } catch (err) {
  console.error("❌ POST /:id/comments error:", err); // <--- додай це
  res.status(500).json({ error: "Помилка сервера" });
}

});



module.exports = router;


