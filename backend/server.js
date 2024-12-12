require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const employeeRoutes = require('./routes/employeeRoutes');

const app = express();

// Middleware
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());

// Mount the employee routes
app.use('/api/employee', employeeRoutes)
// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something broke!' });
});

// 404 handler - Add this to handle undefined routes
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

module.exports = app;
