const express = require('express');

const sampleController = require('../controllers/sampleController');

const router = express.Router();

router.get('/score/:id', sampleController.getSamplesbyScoreId);
router.put('/:id', sampleController.updateSample);
router.delete('/:id', sampleController.deleteSample);

module.exports = router;