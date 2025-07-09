const express = require('express');
const router = express.Router();
const User = require('../models/User');

// GET /users → повернути всіх користувачів
router.get('/', async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
