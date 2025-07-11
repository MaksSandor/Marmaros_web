const express = require('express');
const router = express.Router();
const User = require('../models/User');

// GET /users - отримати всіх користувачів (без _id і __v)
router.get('/', async (req, res) => {
  try {
    const users = await User.find({}, '-__v');
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /users/:id - отримати одного користувача
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id, '-__v');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /users - створити нового користувача
router.post('/', async (req, res) => {
  try {
    const { PIB, gmail, password, verification } = req.body;
    const newUser = new User({ PIB, gmail, password, verification });
    await newUser.save();
    res.status(201).json({ message: 'User created', user: newUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /users/:id - оновити користувача (повністю)
router.put('/:id', async (req, res) => {
  try {
    const { PIB, gmail, password, verification } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { PIB, gmail, password, verification },
      { new: true, runValidators: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ message: 'User updated', user: updatedUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// PATCH /users/:id - оновити користувача (частково)
router.patch('/:id', async (req, res) => {
  try {
    const updates = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ message: 'User partially updated', user: updatedUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /users/:id - видалити користувача
router.delete('/:id', async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ message: 'User deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
