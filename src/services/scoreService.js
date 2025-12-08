const scoreRepository = require('../repositories/scoreRepository');
const sampleRepository = require('../repositories/sampleRepository');
const logger = require('../utils/logger');

// Ensure today's score exists in the scores table
async function ensureTodayScoreExists() {

    try {

        const todayScore = await scoreRepository.getTodayScore();

        if (!todayScore) {
            await scoreRepository.createDefaultScore();
        }
        
    } catch (error) {

	logger.error('Error ensuring today\'s score exists:', error);

    }

    setTimeout(ensureTodayScoreExists, 1000);

}

async function countTodayScore() {
    try {
        const todayScore = await scoreRepository.getTodayScore();

        const samples = await sampleRepository.getSamplesByScoreId(todayScore.id);

        let cleanCount = 0;
        let totalCount = samples.length;

        for (const sample of samples) {
            if (sample.is_clean) {
                cleanCount++;
            }
        }

        const scoreValue = totalCount === 0 ? 100 : Math.round((cleanCount / totalCount) * 100);

        return await scoreRepository.updateScore(todayScore.id, cleanCount, totalCount, scoreValue);
        
    } catch (error) {
        logger.error('Error counting today\'s score:', error);
    }
}

async function countScorebyId(scoreId) {
    try {
        const score = await scoreRepository.getScoreById(scoreId);

        const samples = await sampleRepository.getSamplesByScoreId(score.id);

        let cleanCount = 0;
        let totalCount = samples.length;

        for (const sample of samples) {
            if (sample.is_clean) {
                cleanCount++;
            }
        }

        const scoreValue = totalCount === 0 ? 100 : Math.round((cleanCount / totalCount) * 100);

        return await scoreRepository.updateScore(score.id, cleanCount, totalCount, scoreValue);

    } catch (error) {
        logger.error('Error counting score by ID:', error);
    }
}

module.exports = {
	ensureTodayScoreExists,
    countTodayScore,
    countScorebyId
};

