// ✅ frontCors.js
const dotenv = require('dotenv');
dotenv.config();

const allowedOrigins = [
  process.env.frontend_url,              // https://fileportfolio.vercel.app
  'https://fileportfolio.vercel.app',   // hardcoded backup
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
};

module.exports = { corsOptions };
