const express = require('express');

const violationController = require('../controllers/violationController');

const router = express.Router();

// tested
router.get('/sample/:id', violationController.getViolationsbySampleId);

// tested
router.get('/score/:id', violationController.getViolationsbyScoreId);

// tested
router.get('/summary/score/:id', violationController.getViolationSummarybyScoreId);

module.exports = router;