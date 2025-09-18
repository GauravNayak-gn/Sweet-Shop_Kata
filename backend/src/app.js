const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Simple health check route
app.get('/', (req, res) => {
    res.send('Sweet Shop API is running!');
});

module.exports = app;