const WebSocket = require('ws');
const logger = require('../utils/logger');

let cameraSocket = null;
let clientSockets = new Set();
let shootInterval = null;
let shootIntervalTime = 5000; // in milliseconds

function startShootLoop(ws) {
    if (shootInterval) clearInterval(shootInterval);

    shootInterval = setInterval(() => {
        if (ws.readyState === WebSocket.OPEN) {
            ws.send('shoot');
            logger.info('Shoot signal sent to camera');
        } else {
            logger.info('Camera disconnected, stopping shoot loop');
            clearInterval(shootInterval);
            shootInterval = null;
        }
    }, shootIntervalTime);
}

function sendShootSignal() {
    if (cameraSocket && cameraSocket.readyState === WebSocket.OPEN) {
        cameraSocket.send('shoot');
        logger.info('Shoot signal sent to camera');
        return true;
    } else {
        logger.info('Camera not connected, cannot send shoot signal');
        return false;
    }
}

function assignRole(ws, message) {
    if (message === 'camera') {
        ws.role = 'camera';
        cameraSocket = ws;
        logger.info('Camera connected');

        startShootLoop(ws);

        return;
    }

    if (message === 'client') {
        ws.role = 'client';
        clientSockets.add(ws);
        logger.info('Client connected');
        return;
    }

    logger.warn('Unknown role attempted to connect:', message);
}

function handleWsMessage(ws, rawData) {
    if (!ws.role) {
        return assignRole(ws, rawData.toString());
    }

    if (ws.role === 'camera') {
        clientSockets.forEach(clientWs => {
            if (clientWs.readyState === WebSocket.OPEN) {
                clientWs.send(rawData);
            }
        });
    }
}

function handleWsClose(ws) {
    if (ws.role === 'camera') {
        logger.info('Camera disconnected');
        cameraSocket = null;

        if (shootInterval) {
            clearInterval(shootInterval);
            shootInterval = null;
            logger.info('Shoot loop stopped');
        }
    }

    if (ws.role === 'client') {
        clientSockets.delete(ws);
        logger.info('Client disconnected');
    }
}

module.exports = {
    handleWsMessage,
    handleWsClose,
    sendShootSignal
}