const express = require('express');
const cors = require('cors');
const employeeRoutes = require('./routes/employeeRoutes');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());

// Debug middleware to log all requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

console.log('Mounting employee routes at /api/employee');
app.use('/api/employee', employeeRoutes);

// Test route to verify server is working
app.get('/test', (req, res) => {
  res.json({ message: 'Server is running' });
});

// List all routes for debugging
function printRoutes() {
  console.log('\nRegistered Routes:');
  app._router.stack.forEach(middleware => {
    if (middleware.route) {
      console.log(`${Object.keys(middleware.route.methods)} ${middleware.route.path}`);
    } else if (middleware.name === 'router') {
      middleware.handle.stack.forEach(handler => {
        if (handler.route) {
          console.log(`${Object.keys(handler.route.methods)} /api/employee${handler.route.path}`);
        }
      });
    }
  });
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  printRoutes();
}); 