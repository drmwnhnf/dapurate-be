// webSocketService.js

const WebSocket = require('ws');

let cameraSocket = null;
let clientSockets = new Set();
let shootInterval = null;

function startShootLoop(ws) {
    if (shootInterval) clearInterval(shootInterval);

    shootInterval = setInterval(() => {
        if (ws.readyState === WebSocket.OPEN) {
            ws.send('shoot');
            console.log('Shoot signal sent');
        } else {
            console.log('Camera not open — stopping shoot loop');
            clearInterval(shootInterval);
            shootInterval = null;
        }
    }, 1000);
}

function assignRole(ws, message) {
    if (message === 'camera') {
        ws.role = 'camera';
        cameraSocket = ws;
        console.log('Camera connected');

        startShootLoop(ws);

        return;
    }

    if (message === 'client') {
        ws.role = 'client';
        clientSockets.add(ws);
        console.log('Client connected');
        return;
    }

    console.log("Unknown role:", message);
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
        console.log('Camera disconnected');
        cameraSocket = null;

        if (shootInterval) {
            clearInterval(shootInterval);
            shootInterval = null;
            console.log('Shoot loop stopped');
        }
    }

    if (ws.role === 'client') {
        clientSockets.delete(ws);
        console.log('Client disconnected');
    }
}

module.exports = {
    handleWsMessage,
    handleWsClose
}