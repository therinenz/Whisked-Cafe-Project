require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const employeeRoutes = require('./routes/employeeRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const app = express();

// Middleware
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Debug middleware
app.use((req, res, next) => {
  console.log('Request URL:', req.originalUrl);
  next();
});

// Mount the routes
app.use('/api/employee', employeeRoutes)
app.use('/api/inventory', inventoryRoutes)
app.use('/api/categories', categoryRoutes);


// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
});

// 404 handler - Add this to handle undefined routes
app.use((req, res) => {
    res.status(404).json({
        error: 'Not Found',
        message: `Route ${req.originalUrl} not found`
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

module.exports = app;
