const express = require('express');
const router = express.Router();
const Category = require('../models/category');

//Get all categories
router.get('/', async (req, res) => {
  let searchOptions = {};
  if (searchOptions != null && searchOptions != '') {
    searchOptions.name = new RegExp(req.query.name, 'i');
  }

  await Category.find(searchOptions)
    .then((categories) =>
      res.render('categories/index', {
        categories: categories,
        searchOptions: req.query,
      }),
    )
    .catch((error) => {
      console.log(error);
      res.redirect('/');
    });
});

//Display new category form
router.get('/new', (req, res) => {
  res.render('categories/new', { category: new Category() });
});

//Create new category
router.post('/', async (req, res) => {
  const category = new Category({
    name: req.body.name,
  });
  await category
    .save()
    .then((result) => res.redirect('/categories'))
    .catch((error) => {
      res.render('categories/new', {
        category: category,
        errorMessage: 'Error creating new category',
      });
    });
});

module.exports = router;
