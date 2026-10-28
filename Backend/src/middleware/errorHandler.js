module.exports = (error, _req, res, _next) => {
  if (error.status) return res.status(error.status).json({ error: error.message });
  if (error.type === 'entity.parse.failed') return res.status(400).json({ error: 'Invalid JSON body.' });
  console.error('Request failed:', error.code || error.message);
  res.status(503).json({ error: 'Service unavailable. Check that MySQL is running and Backend/.env matches your database.' });
};
