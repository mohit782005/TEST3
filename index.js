const express = require('express');
const app = express();
const PORT = Math.floor(Math.random() * 1000) + 3000;

const users = {};

app.use(express.json());

app.get('/', (req, res) => {
  console.log(`[${new Date().toISOString()}] GET /`);
  res.json({ status: 'ok', project: 'test2-b9a9ee58', uptime: process.uptime() });
});

app.get('/health', (req, res) => {
  console.log(`[${new Date().toISOString()}] GET /health`);
  res.json({ healthy: true, memory: process.memoryUsage() });
});

// This endpoint has a bug — accessing .profile on undefined user
app.get('/api/users/:id', (req, res) => {
  console.log(`[${new Date().toISOString()}] GET /api/users/${req.params.id}`);
  const user = users[req.params.id];
  // BUG: no null check — crashes if user doesn't exist
  const profile = user.profile;
  res.json(profile);
});

// Heartbeat
setInterval(() => {
  console.log(`[${new Date().toISOString()}] Heartbeat — uptime: ${Math.floor(process.uptime())}s`);
}, 10000);

app.listen(PORT, () => {
  console.log(`🚀 test2-b9a9ee58 server running on http://localhost:${PORT}`);
  console.log(`📡 Nexus-X telemetry: ACTIVE`);
});
