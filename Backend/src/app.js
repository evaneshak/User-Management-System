const express = require('express');
const cors = require('cors');
const pool = require('./config/db');
const app = express();
app.use(cors({ origin(origin, callback) {
  if (!origin || /^https?:\/\/localhost(?::\d+)?$/.test(origin) || /^https?:\/\/127\.0\.0\.1(?::\d+)?$/.test(origin)) return callback(null, true);
  return callback(new Error('Origin not allowed'));
} }));
app.use(express.json({ limit: '16kb' }));
app.get('/api/health', async (_req, res) => {
  try { await pool.query('SELECT 1'); res.json({ api: 'ok', database: 'ok' }); }
  catch { res.status(503).json({ api: 'ok', database: 'unavailable' }); }
});
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use((_req, res) => res.status(404).json({ error: 'Endpoint not found.' }));
app.use(require('./middleware/errorHandler'));
module.exports = app;
