const express = require('express');
const router = express.Router();
const { resource } = require('router-plus');
const CategoryController = require('../controllers/CategoryController');

resource(router, CategoryController);

module.exports = router;
