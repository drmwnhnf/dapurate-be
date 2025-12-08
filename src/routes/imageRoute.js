const express = require('express');

const imageController = require('../controllers/imageController');
const imageMiddleware = require('../middlewares/imageMiddleware');
const sampleMiddleware = require('../middlewares/sampleMiddleware');

const router = express.Router();

// tested
router.post('/upload', sampleMiddleware.createSampleMiddleware, imageMiddleware.rawImageUpload, imageController.uploadImage);


router.get('/raw/:id', imageController.getRawImage);
router.get('/result/:id', imageController.getResultImage);

module.exports = router;