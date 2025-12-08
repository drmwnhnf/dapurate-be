const sampleRepository = require('../repositories/sampleRepository');
const scoreRepository = require('../repositories/scoreRepository');

async function createSampleMiddleware(req, res, next) {
    try {
        const score = await scoreRepository.getTodayScore() ?? await scoreRepository.createDefaultScore();

        const sample = await sampleRepository.createDefaultSample(score.id);

        req.sample = sample;

        next();
    } catch (error) {
        next(error);
    }
}

module.exports = {
    createSampleMiddleware
};