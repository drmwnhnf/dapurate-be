const WebSocket = require('ws');

const wsService = require('./wstestservice');

// index.js

const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
    ws.role = null;

    ws.on('message', (rawData) => wsService.handleWsMessage(ws, rawData));

    ws.on('close', () => wsService.handleWsClose(ws));
});