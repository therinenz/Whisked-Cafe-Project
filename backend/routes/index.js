const express = require('express');
const cors = require('cors');
const employeeRoutes = require('./routes/employeeRoutes');
const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // Your React app's URL
  credentials: true
}));

app.use(express.json());

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'Server is running' });
});

// Routes
app.use('/api/employee', employeeRoutes);

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
}); 