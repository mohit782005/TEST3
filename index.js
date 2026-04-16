const express = require('express');
const app = express();
const PORT = Math.floor(Math.random() * 1000) + 3000;

app.get('/', (req, res) => {
  console.log(`[${new Date().toISOString()}] GET / hit in test2-b9a9ee58`);
  res.json({ status: 'ok', project: 'test2-b9a9ee58' });
});

app.listen(PORT, () => {
  console.log(`🚀 test2-b9a9ee58 server running on http://localhost:${PORT}`);
});
