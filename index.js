const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const WebSocket = require('ws');
const http = require('http');

const { ensureTodayScoreExists } = require('./src/services/scoreService');
const logger = require('./src/utils/logger');
const dbConfig = require('./src/configs/dbConfig');
const requestLogger = require('./src/middlewares/requestLogger');
const imageRoute = require('./src/routes/imageRoute');
const sampleRoute = require('./src/routes/sampleRoute');
const scoreRoute = require('./src/routes/scoreRoute');
const violationRoute = require('./src/routes/violationRoute');
const webSocketService = require('./src/services/webSocketService');

const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE',]
};

dbConfig.databaseConnectionTest();
ensureTodayScoreExists();

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  ws.role = null;

  ws.on('message', (rawData) => webSocketService.handleWsMessage(ws, rawData));

  ws.on('close', () => webSocketService.handleWsClose(ws));
});
logger.info('WebSocket server is running.');

app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger)

app.use('/image', imageRoute);
app.use('/sample', sampleRoute);
app.use('/score', scoreRoute);
app.use('/violation', violationRoute);
app.get('/', (req, res) => {
  res.send('Hello from Dapurate BE!');
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});