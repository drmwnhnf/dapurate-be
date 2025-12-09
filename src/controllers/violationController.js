const violationRepository = require('../repositories/violationRepository');
const logger = require('../utils/logger');

async function getViolationsbySampleId(req, res) {
    try {
        const sampleId = req.params.id;
        const violations = await violationRepository.getViolationsBySampleId(sampleId);
        return res.status(200).json({ message: 'Successfully fetched violations', data: violations, success: true });
    } catch (error) {
        logger.error('Error fetching violations by sample ID:', error);
        return res.status(500).json({ message: 'Internal server error', data: null, success: false });
    }
}

async function getViolationsbyScoreId(req, res) {
    try {
        const scoreId = req.params.id;
        const violations = await violationRepository.getViolationsByScoreId(scoreId);
        return res.status(200).json({ message: 'Successfully fetched violations', data: violations, success: true });
    } catch (error) {
        logger.error('Error fetching violations by score ID:', error);
        return res.status(500).json({ message: 'Internal server error', data: null, success: false });
    }
}

async function getViolationSummarybyScoreId(req, res) {
    try {
        const scoreId = req.params.id;
        const violations = await violationRepository.getViolationsByScoreId(scoreId);

        const summary = violations.reduce((acc, violation) => {
            if (!acc[violation.name]) {
                acc[violation.name] = 0;
            }
            acc[violation.name] += violation.total;
            return acc;
        }, {});

        return res.status(200).json({ message: 'Successfully fetched violation summary', data: summary, success: true });
    } catch (error) {
        logger.error('Error fetching violation summary by score ID:', error);
        return res.status(500).json({ message: 'Internal server error', data: null, success: false });
    }
}

module.exports = {
    getViolationsbySampleId,
    getViolationsbyScoreId,
    getViolationSummarybyScoreId
};