const express = require('express');
const eventRoutes = require('./routes/events');

const app = express();
app.use(express.json());
app.use('/api/events', eventRoutes);

module.exports = app;
