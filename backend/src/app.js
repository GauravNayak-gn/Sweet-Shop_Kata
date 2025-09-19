const express = require('express');
const cors = require('cors');
const app = express();

const authRoutes = require('./api/routes/auth.routes');
const sweetRoutes = require('./api/routes/sweets.routes');

app.use(cors());
app.use(express.json());

// Simple health check route
app.get('/', (req, res) => {
    res.send('Sweet Shop API is running!');
});

app.use('/api/auth', authRoutes);
app.use('/api/sweets', sweetRoutes);

module.exports = app;