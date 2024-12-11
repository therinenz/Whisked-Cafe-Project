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

// Use routes
app.use('/api/employee', employeeRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
