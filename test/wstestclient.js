const WebSocket = require('ws');
const http = require('http');

const ws = new WebSocket('ws://localhost:8080');

ws.on('open', () => {
    ws.send('client');
});

ws.on('message', (data) => {
    // No buffering needed; browser page will open its own WS connection.
});

ws.on('error', (err) => {
    console.error('WebSocket error:', err);
});

ws.on('close', () => {
    console.log('WebSocket closed');
});

const html = `<!doctype html>
<html>
<head><meta charset="utf-8"><title>WS Image Viewer</title></head>
<body>
<h3>Live Images via WebSocket</h3>
<img id="img" alt="waiting..." style="max-width:100%;border:1px solid #ccc"/>
<script>
(function(){
  const imgEl = document.getElementById('img');
  const ws = new WebSocket('ws://localhost:8080');
  ws.binaryType = 'arraybuffer';
  ws.addEventListener('open', () => ws.send('client'));
  let lastUrl = null;

  ws.addEventListener('message', (ev) => {
    const blob = new Blob([ev.data], { type: 'image/jpeg' }); // adjust if your images are PNG
    const url = URL.createObjectURL(blob);
    imgEl.src = url;
    if (lastUrl) URL.revokeObjectURL(lastUrl);
    lastUrl = url;
  });

  ws.addEventListener('close', () => console.log('WS closed'));
  ws.addEventListener('error', (e) => console.error('WS error', e));
})();
</script>
</body>
</html>`;

http.createServer((req, res) => {
    if (req.method === 'GET' && req.url === '/') {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(html);
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
}).listen(3000, () => {
    console.log('HTTP server listening on port 3000');
});