const app = require('./app');
const port = Number(process.env.PORT || 5050);
app.listen(port, () => console.log(`API listening at http://localhost:${port}`));
