const express = require('express');
const router = express.Router();
const { resource } = require('router-plus');
const BookController = require('../controllers/BookController');

resource(router, BookController);

module.exports = router;
