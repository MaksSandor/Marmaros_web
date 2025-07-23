const express = require("express");
const router = express.Router();
const Tour = require("../models/Tour");

// GET all tours with filters
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

module.exports = router;


