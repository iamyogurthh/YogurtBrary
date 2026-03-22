const express = require('express');
const router = express.Router();

const Book = require('../models/book');

router.get('/', async (req, res) => {
  try {
    const books = await Book.find({}).sort({ createdAt: 'desc' }).limit(10);
    res.render('index', { books: books });
  } catch (error) {
    const books = [];
  }
});

module.exports = router;
