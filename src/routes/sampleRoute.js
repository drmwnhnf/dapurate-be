const express = require('express');

const sampleController = require('../controllers/sampleController');

const router = express.Router();
// tested
router.get('/score/:id', sampleController.getSamplesbyScoreId);

// tested
router.get('/:id', sampleController.getSamplebyId);

// tested
router.put('/:id', sampleController.updateSample);

// tested
router.delete('/:id', sampleController.deleteSample);

module.exports = router;