const express = require('express');
const router = express.Router();
const Book = require('../models/book');
const Author = require('../models/author');
const Category = require('../models/category');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadPath = path.join('public', Book.coverImageBasePath);
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg'];

const upload = multer({
  dest: uploadPath,
  fileFilter: (req, file, callback) => {
    callback(null, imageMimeTypes.includes(file.mimetype));
  },
});

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

async function removeBookCoverImage(fileName) {
  fs.unlink(path.join(uploadPath, fileName), (error) => {
    if (error) console.error(error);
  });
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
router.post('/', upload.single('cover'), async (req, res) => {
  const fileName = req.file != null ? req.file.filename : null;
  console.log(fileName);
  const book = new Book({
    title: req.body.title,
    author: req.body.author,
    publishDate: new Date(req.body.publishDate),
    pageCount: req.body.pageCount,
    coverImageName: fileName,
    description: req.body.description,
    category: req.body.category,
  });

  await book
    .save()
    .then((result) => res.redirect('/books'))
    .catch(async (error) => {
      if (book.coverImageName != null) {
        removeBookCoverImage(book.coverImageName);
      }
      renderNewPage(res, book, true);
    });
});

module.exports = router;
