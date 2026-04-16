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

// This endpoint crashes the ENTIRE process (not just the request)
app.get('/api/users/:id', (req, res) => {
  console.log(`[${new Date().toISOString()}] GET /api/users/${req.params.id}`);
  console.log(`[${new Date().toISOString()}] Looking up user in cache...`);
  
  const user = users[req.params.id];

  if (!user) {
    console.error(`[FATAL] User ${req.params.id} not found in cache`);
    console.error(`[FATAL] Null reference in user lookup pipeline`);
    
    // Simulate an unhandled async crash that kills the process
    process.nextTick(() => {
      throw new Error(`Cannot read properties of undefined (reading 'profile') - user ${req.params.id} does not exist`);
    });
    return;
  }

  res.json(user.profile);
});

// Heartbeat
setInterval(() => {
  console.log(`[${new Date().toISOString()}] Heartbeat — uptime: ${Math.floor(process.uptime())}s`);
}, 10000);

app.listen(PORT, () => {
  console.log(`🚀 test2-b9a9ee58 server running on http://localhost:${PORT}`);
  console.log(`📡 Nexus-X telemetry: ACTIVE`);
});
