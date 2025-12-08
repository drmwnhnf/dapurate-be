const sampleRepository = require('../repositories/sampleRepository');
const scoreService = require('../services/scoreService');
const logger = require('../utils/logger');

async function getSamplesbyScoreId(req, res) {
    try {
        const scoreId = req.params.id;
        const samples = await sampleRepository.getSamplesByScoreId(scoreId);

        if (!samples || samples.length === 0) {
            return res.status(404).json({ message: 'No samples found for the given score ID', data: null, success: false });
        }

        return res.status(200).json({ message: 'Samples retrieved successfully', data: samples, success: true });
    } catch (error) {
        logger.error('Error retrieving samples by score ID:', error);
        return res.status(500).json({ message: 'Internal server error', data: null, success: false });
    }
}

async function updateSample(req, res) {
    try {
        const sampleId = req.params.id;
        const is_clean = req.body.is_clean;
        
        const updatedSample = await sampleRepository.updateSample(sampleId, is_clean);

        if (!updatedSample) {
            return res.status(404).json({ message: 'Sample not found', data: null, success: false });
        }

        scoreService.countScorebyId(updatedSample.score_id);
        return res.status(200).json({ message: 'Sample updated successfully', data: updatedSample, success: true });
    } catch (error) {
        logger.error('Error updating sample:', error);
        return res.status(500).json({ message: 'Internal server error', data: null, success: false });
    }
}

async function deleteSample(req, res) {
    try {
        const sampleId = req.params.id;
        const deletedSample = await sampleRepository.deleteSample(sampleId);

        if (!deletedSample) {
            return res.status(404).json({ message: 'Sample not found', data: null, success: false });
        }

        scoreService.countScorebyId(deletedSample.score_id);

        return res.status(200).json({ message: 'Sample deleted successfully', data: deletedSample, success: true });
    } catch (error) {
        logger.error('Error deleting sample:', error);
        return res.status(500).json({ message: 'Internal server error', data: null, success: false });
    }
}

module.exports = {
    getSamplesbyScoreId,
    deleteSample,
    updateSample
};