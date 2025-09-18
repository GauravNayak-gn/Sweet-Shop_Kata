const express = require('express');
const cors = require('cors');
const app = express();

const authRoutes = require('./api/routes/auth.routes');

app.use(cors());
app.use(express.json());

// Simple health check route
app.get('/', (req, res) => {
    res.send('Sweet Shop API is running!');
});

app.use('/api/auth', authRoutes);

module.exports = app;