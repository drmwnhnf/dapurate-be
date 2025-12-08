const WebSocket = require('ws');
const fs = require('fs');
const path = require('path');

const ws = new WebSocket('ws://localhost:8080');

ws.on('open', () => {
    ws.send('camera');

    const imgDir = path.resolve('d:\\despro\\dapurate-be\\test\\images');
    const files = ['1.jpg', '2.jpg', '3.jpg', '4.jpg', '5.jpg']
        .map(f => path.join(imgDir, f));

    let buffers = [];
    try {
        buffers = files.map(f => fs.readFileSync(f));
    } catch (e) {
        console.error('Failed to load images:', e);
        return;
    }

    let idx = 0;
    const intervalId = setInterval(() => {
        if (ws.readyState !== WebSocket.OPEN) return;
        ws.send(buffers[idx], { binary: true });
        idx = (idx + 1) % buffers.length;
    }, 500);

    ws.on('close', () => clearInterval(intervalId));
});

ws.on('message', (data) => {
    // Optionally handle server messages
});

ws.on('error', (err) => {
    console.error('WebSocket error:', err);
});