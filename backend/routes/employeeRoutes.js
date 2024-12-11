const express = require('express');
const router = express.Router();
const db = require('../config/db');

console.log('Loading employee routes...');

// Get all employees
router.get('/', (req, res) => {
  const query = `
    SELECT id, name, email, mobile, role, created_at, last_logged_in, updated_at 
    FROM employee
  `;
  
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching employees:', err);
      return res.status(500).json({ error: 'Error fetching employees' });
    }
    res.json(results);
  });
});

// Add new employee
router.post('/', (req, res) => {
  const { name, email, password, mobile, role } = req.body;
  
  // Validate required fields
  if (!name || !email || !password || !role) {
    return res.status(400).json({ 
      error: 'Missing required fields',
      details: 'Name, email, password, and role are required'
    });
  }

  const query = `
    INSERT INTO employee (name, email, password, mobile, role) 
    VALUES (?, ?, ?, ?, ?)
  `;
  
  db.query(query, [name, email, password, mobile, role], (err, result) => {
    if (err) {
      console.error('Database error while adding employee:', err);
      return res.status(500).json({ 
        error: 'Error adding employee',
        details: err.message 
      });
    }
    
    // Fetch the newly created employee
    db.query('SELECT * FROM employee WHERE id = ?', [result.insertId], (err, results) => {
      if (err) {
        console.error('Error fetching new employee:', err);
        return res.status(500).json({ 
          error: 'Error fetching new employee',
          details: err.message 
        });
      }
      
      console.log('Successfully added employee:', results[0]);
      res.status(201).json(results[0]);
    });
  });
});

// Get roles endpoint
router.get('/roles', (req, res) => {
  console.log('Roles endpoint hit'); // Debug log
  
  const query = `SHOW COLUMNS FROM employee WHERE Field = 'role'`;
  
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching roles:', err);
      return res.status(500).json({ error: 'Error fetching roles' });
    }
    
    console.log('Database results:', results); // Debug log
    
    if (!results || results.length === 0) {
      return res.status(404).json({ error: 'Role field not found' });
    }

    try {
      const enumString = results[0].Type;
      console.log('Enum string:', enumString); // Add this line
      
      // Simplified enum parsing
      const cleanEnum = enumString.replace('enum(', '').replace(')', '');
      const enumValues = cleanEnum.split(',').map(value => 
        value.replace(/'/g, '').trim()
      );

      console.log('Parsed enum values:', enumValues); // Debug log
      res.json(enumValues);
    } catch (error) {
      console.error('Error parsing enum values:', error);
      res.status(500).json({ error: 'Error parsing role values' });
    }
  });
});

module.exports = router;