const express = require('express');
router = express.Router();
const { resource } = require('router-plus');
const AuthorController = require('../controllers/AuthorController');

resource(router, AuthorController);

module.exports = router;
