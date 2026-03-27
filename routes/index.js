const express = require('express');
const router = express.Router();
const { resource } = require('router-plus');
const indexController = require('../controllers/indexController');

resource(router, indexController);

module.exports = router;
