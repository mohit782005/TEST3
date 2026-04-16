const express = require('express');
const app = express();
const PORT = Math.floor(Math.random() * 1000) + 3000;

// In-memory user store
const users = {};

app.use(express.json());

app.get('/', (req, res) => {
  console.log(`[${new Date().toISOString()}] GET / hit in test2-b9a9ee58`);
  res.json({ status: 'ok', project: 'test2-b9a9ee58', uptime: process.uptime() });
});

app.get('/health', (req, res) => {
  console.log(`[${new Date().toISOString()}] GET /health`);
  res.json({ healthy: true, memory: process.memoryUsage() });
});

// BUG: This endpoint has a null reference crash
app.get('/api/users/:id', (req, res) => {
  console.log(`[${new Date().toISOString()}] GET /api/users/${req.params.id}`);
  const user = users[req.params.id];
  // BUG: accessing .profile on undefined user — CRASH!
  const profile = user.profile;
  res.json(profile);
});

// Simulate periodic traffic that eventually hits the bug
let requestCount = 0;
setInterval(() => {
  requestCount++;
  console.log(`[${new Date().toISOString()}] Heartbeat #${requestCount} — ${Object.keys(users).length} users cached`);

  // After 20 seconds, simulate a request to a non-existent user
  if (requestCount === 4) {
    console.log(`[${new Date().toISOString()}] Processing webhook: user lookup for id=usr_98432...`);
    try {
      const user = users['usr_98432'];
      const name = user.profile.displayName;  // 💥 CRASH — TypeError: Cannot read properties of undefined
      console.log(`Found user: ${name}`);
    } catch (err) {
      console.error(`[FATAL] Unhandled exception in webhook handler:`);
      console.error(`  TypeError: ${err.message}`);
      console.error(`  at Object.<anonymous> (index.js:38:30)`);
      console.error(`  at processTicksAndRejections (node:internal/process/task_queues:95:5)`);
      console.error(`[CRASH] Server shutting down due to unrecoverable error`);
      process.exit(1);
    }
  }
}, 5000);

app.listen(PORT, () => {
  console.log(`🚀 test2-b9a9ee58 server running on http://localhost:${PORT}`);
  console.log(`📡 Nexus-X telemetry: ${process.env.NEXUS_TELEMETRY || 'ACTIVE'}`);
});
