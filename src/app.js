const express = require('express');
const eventRoutes = require('./routes/events');
const authRoutes = require('./routes/auth');

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);

module.exports = app;
