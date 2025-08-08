const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));

connectDB();

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/reports', require('./routes/reports'));
app.use('/api/shelters', require('./routes/shelters'));
app.use('/api/volunteers', require('./routes/volunteers'));
app.use('/api/tasks', require('./routes/tasks'));
app.use('/api/donations', require('./routes/donations'));
app.use('/api/lostfound', require('./routes/lostfound'));
app.use('/api/health', (req, res) => res.json({ status: 'ok' }));

// error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message || 'Server error' });
});

module.exports = app;
