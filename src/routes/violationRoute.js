const express = require('express');

const violationController = require('../controllers/violationController');

const router = express.Router();

router.get('/sample/:id', violationController.getViolationsbySampleId);
router.get('/score/:id', violationController.getViolationsbyScoreId);
router.get('/summary/score/:id', violationController.getViolationSummarybyScoreId);

module.exports = router;