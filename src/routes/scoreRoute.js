const express = require('express');

const scoreController = require('../controllers/scoreController');

const router = express.Router();

router.get('/', scoreController.getScore);

module.exports = router;