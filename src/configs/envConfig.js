const dotenv = require('dotenv');

dotenv.config();

module.exports = {
  port: process.env.PORT,
  dbUrl: process.env.DATABASE_URL,
  frontendUrl: process.env.FRONTEND_URL,
  ml_api_url: process.env.ML_API_URL
};