// routes/comments.js
const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');
const Tour = require('../models/Tour');

/**
 * GET /api/comments/tour/:name
 * Повертає коментарі до туру за назвою (name)
 */
router.get('/tour/:name', async (req, res) => {
  try {
    const tour = await Tour.findOne({ name: req.params.name });
    if (!tour) return res.status(404).json({ message: 'Тур не знайдено' });

    const comments = await Comment.find({ tour: tour._id })
      .populate('author', 'username gmail PIB') // що показувати у фронті
      .sort({ createdAt: 1 });

    res.json(comments);
  } catch (err) {
    console.error('[comments] GET tour/:name', err);
    res.status(500).json({ message: 'Помилка сервера' });
  }
});

/**
 * GET /api/comments/tour-id/:id
 * Альтернатива по ObjectId тура
 */
router.get('/tour-id/:id', async (req, res) => {
  try {
    const comments = await Comment.find({ tour: req.params.id })
      .populate('author', 'username gmail PIB')
      .sort({ createdAt: 1 });

    res.json(comments);
  } catch (err) {
    console.error('[comments] GET tour-id/:id', err);
    res.status(500).json({ message: 'Помилка сервера' });
  }
});

/**
 * POST /api/comments
 * Body: { text, author, tour }
 * author — ObjectId користувача, tour — ObjectId туру
 */
router.post('/', async (req, res) => {
  try {
    const { text, author, tour } = req.body;
    if (!text || !author || !tour) {
      return res.status(400).json({ message: 'text, author, tour — обовʼязкові' });
    }

    const c = new Comment({ text, author, tour });
    await c.save();
    const populated = await c.populate('author', 'username gmail PIB');
    res.status(201).json(populated);
  } catch (err) {
    console.error('[comments] POST /', err);
    res.status(500).json({ message: 'Не вдалося створити коментар' });
  }
});

/**
 * (Опційно) DELETE /api/comments/:id
 * Видалити коментар (додай свій захист/перевірку власника)
 */
router.delete('/:id', async (req, res) => {
  try {
    await Comment.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (err) {
    console.error('[comments] DELETE /:id', err);
    res.status(500).json({ message: 'Не вдалося видалити' });
  }
});

module.exports = router;
