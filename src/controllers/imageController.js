const violationRepository = require('../repositories/violationRepository');
const sampleRepository = require('../repositories/sampleRepository');
const detectService = require('../services/detectService');
const scoreService = require('../services/scoreService');
const logger = require('../utils/logger');

async function uploadImage(req, res) {
    try {
        const filename = req.filename;

        const detectResult = await detectService.requestDetect(filename);

        if (!detectResult.is_clean) {
            await sampleRepository.updateSample(req.sample.id, false);
            for (const violation of detectResult.violations) {
                await violationRepository.createViolation(
                    req.sample.score_id,
                    req.sample.id,
                    violation.name,
                    violation.count
                );
            }
        }

        const score = await scoreService.countTodayScore();

        console.log(req.sample.id);

        return res.status(200).json({ message: 'Image uploaded and detected successfully', data: score });

    } catch (error) {
        logger.error('Error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = {
    uploadImage
};


