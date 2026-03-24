const express = require('express');
const router = express.Router();
const BookController = require('../controllers/indexController');
const { resource } = require('router-plus');

resource(router, BookController);

module.exports = router;
