const path = require('path');
const fs = require('fs');

const violationRepository = require('../repositories/violationRepository');
const sampleRepository = require('../repositories/sampleRepository');
const detectService = require('../services/detectService');
const scoreService = require('../services/scoreService');
const webSocketService = require('../services/webSocketService');
const logger = require('../utils/logger');

async function uploadImage(req, res) {
    try {
        const filename = req.filename;

        const detectResult = await detectService.requestDetect(res, filename);

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

        return res.status(200).json({ message: 'Image uploaded and detected successfully', data: score, success: true });

    } catch (error) {
        logger.error('Error:', error);
        return res.status(500).json({ message: 'Internal server error', data: null, success: false });
    }
}

async function getRawImage(req, res) {
    try {
        const sampleId = req.params.id;
        const filePath = path.join(__dirname, '../../image/raw/', `${sampleId}.jpeg`);

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ message: 'Image not found', data: null, success: false });
        }

        return res.sendFile(filePath);
    } catch (error) {
        logger.error('Error fetching raw image:', error);
        return res.status(500).json({ message: 'Internal server error', data: null, success: false });
    }
}

async function getResultImage(req, res) {
    try {
        const sampleId = req.params.id;
        const filePath = path.join(__dirname, '../../image/result/', `${sampleId}.jpeg`);
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ message: 'Image not found', data: null, success: false });
        }

        return res.sendFile(filePath);
    } catch (error) {
        logger.error('Error fetching result image:', error);
        return res.status(500).json({ message: 'Internal server error', data: null, success: false });
    }
}

async function shootImage(req, res) {
    try {
        const shootSent = webSocketService.sendShootSignal();
        if (shootSent) {
            return res.status(200).json({ message: 'Shoot signal sent to camera', data: null, success: true });
        }
        return res.status(503).json({ message: 'Camera not connected', data: null, success: false });
    } catch (error) {
        logger.error('Error sending shoot signal:', error);
        return res.status(500).json({ message: 'Internal server error', data: null, success: false });
    }
}

module.exports = {
    uploadImage,
    getRawImage,
    getResultImage,
    shootImage
};


