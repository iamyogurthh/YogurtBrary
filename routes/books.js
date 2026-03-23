const express = require('express');
const router = express.Router();
const Book = require('../models/book');
const Author = require('../models/author');
const Category = require('../models/category');

async function renderNewPage(res, book, hasError = false) {
  try {
    const authors = await Author.find({});
    const categories = await Category.find({});
    const params = {
      authors: authors,
      book: book,
      categories: categories,
    };
    if (hasError) params.errorMessage = 'Error creating book';
    res.render('books/new', params);
  } catch (error) {
    res.redirect('/books');
  }
}

async function saveCover(book, coverEncoded) {
  if (coverEncoded == null) return;

  const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg'];

  const cover = JSON.parse(coverEncoded);
  if (cover != null && imageMimeTypes.includes(cover.type)) {
    book.coverImage = new Buffer.from(cover.data, 'base64');
    book.coverImageType = cover.type;
  }
}

//Get all books
router.get('/', async (req, res) => {
  let query = Book.find();
  if (req.query.title != null && req.query.title != '') {
    query = query.regex('title', new RegExp(req.query.title, 'i'));
  }

  if (req.query.publishedBefore != null && req.query.publishedBefore != '') {
    query = query.lte('publishDate', req.query.publishedBefore);
  }

  if (req.query.publishedAfter != null && req.query.publishedAfter != '') {
    query = query.gte('publishDate', req.query.publishedAfter);
  }

  await query
    .exec()
    .then((books) =>
      res.render('books/index', {
        books: books,
        searchOptions: req.query,
      }),
    )
    .catch((error) => res.redirect('/'));
});

//display new book form
router.get('/new', async (req, res) => {
  renderNewPage(res, new Book());
});

//create new book
router.post('/', async (req, res) => {
  const book = new Book({
    title: req.body.title,
    author: req.body.author,
    publishDate: new Date(req.body.publishDate),
    pageCount: req.body.pageCount,
    description: req.body.description,
    category: req.body.category,
  });

  saveCover(book, req.body.cover);

  await book
    .save()
    .then((result) => res.redirect('/books'))
    .catch(async (error) => {
      renderNewPage(res, book, true);
    });
});

module.exports = router;
