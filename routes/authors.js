const express = require('express');
router = express.Router();

const Author = require('../models/author');

//Get all authors
router.get('/', async (req, res) => {
  let searchOptions = {};
  if (req.query.name != null && req.query.name != '') {
    searchOptions.name = new RegExp(req.query.name, 'i');
  }

  await Author.find(searchOptions)
    .then((authors) =>
      res.render('authors/index', {
        authors: authors,
        searchOptions: req.query,
      }),
    )
    .catch((error) => res.redirect('/'));
});

//Display new author form
router.get('/new', (req, res) => {
  res.render('authors/new', { author: new Author() });
});

//Create new author
router.post('/', async (req, res) => {
  const author = new Author({
    name: req.body.name,
  });
  await author
    .save()
    .then((result) => res.redirect('/authors'))
    .catch((error) =>
      res.render('authors/new', {
        author: author,
        errorMessage: 'Error creating Author',
      }),
    );
});

module.exports = router;
