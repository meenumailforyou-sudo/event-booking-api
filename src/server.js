const app = require('./app');

const PORT = 3000;
const server = app.listen(PORT);

server.on('listening', () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

server.on('error', (err) => {
  console.error('Failed to start server:', err.code, '-', err.message);
  process.exit(1);
});
