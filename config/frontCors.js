// For CommonJS syntax
const dotenv = require('dotenv');
dotenv.config();

const corsOptions = {
  origin: function (origin, callback) {
    const isAllowed =
      !origin ||
      origin === process.env.frontend_url ||
      origin.endsWith('.vercel.app');

    callback(isAllowed ? null : new Error('Not allowed by CORS'), isAllowed);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
};

module.exports = { corsOptions };
