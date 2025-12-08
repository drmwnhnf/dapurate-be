const scoreRepository = require('../repositories/scoreRepository');

async function getScore(req, res) {
    try {
        const date = req.query.date;
        
        if (!date) {
            const todayScore = await scoreRepository.getTodayScore();
            return res.status(200).json({ message: 'Today\'s score retrieved successfully', data: todayScore, success: true });
        }

        const scoreByDate = await scoreRepository.getScorebyDate(date);
        if (!scoreByDate) {
            return res.status(404).json({ message: `No score found for date: ${date}`, data: null, success: false });
        }

        return res.status(200).json({ message: `Score for date ${date} retrieved successfully`, data: scoreByDate, success: true });
    } catch (error) {
        console.error('Error retrieving score:', error);
        return res.status(500).json({ message: 'Internal server error', data: null, success: false });
    }
}

module.exports = {
    getScore
};