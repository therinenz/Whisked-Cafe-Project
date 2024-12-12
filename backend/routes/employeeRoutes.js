const express = require('express');
const router = express.Router();
const db = require('../config/db');

console.log('Loading employee routes...');

// 1. GET all employees
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

// 2. GET roles (must come before /:id)
router.get('/roles', (req, res) => {
  console.log('Roles endpoint hit');
  const query = `SHOW COLUMNS FROM employee WHERE Field = 'role'`;
  
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching roles:', err);
      return res.status(500).json({ error: 'Error fetching roles' });
    }
    
    if (!results || results.length === 0) {
      return res.status(404).json({ error: 'Role field not found' });
    }

    try {
      const enumString = results[0].Type;
      const cleanEnum = enumString.replace('enum(', '').replace(')', '');
      const enumValues = cleanEnum.split(',').map(value => 
        value.replace(/'/g, '').trim()
      );
      res.json(enumValues);
    } catch (error) {
      console.error('Error parsing enum values:', error);
      res.status(500).json({ error: 'Error parsing role values' });
    }
  });
});

// 3. GET single employee by ID
router.get('/:id', (req, res) => {
  const employeeId = req.params.id;
  console.log('Route hit - Fetching employee with ID:', employeeId);

  // Validate employeeId is a number
  if (isNaN(employeeId)) {
    console.log('Invalid ID format:', employeeId);
    return res.status(400).json({ error: 'Invalid employee ID format' });
  }

  const query = `
    SELECT * FROM employee WHERE id = ?
  `;

  console.log('Executing query:', query, 'with ID:', employeeId);

  db.query(query, [employeeId], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ 
        error: 'Database error', 
        details: err.message 
      });
    }

    console.log('Query results:', results);

    if (!results || results.length === 0) {
      console.log('No employee found with ID:', employeeId);
      return res.status(404).json({ 
        error: 'Employee not found',
        details: `No employee exists with ID ${employeeId}`
      });
    }

    res.json(results[0]);
  });
});

// 4. POST new employee
router.post('/', (req, res) => {
  const { name, email, password, mobile, role } = req.body;
  
  // Validate required fields
  if (!name || !email || !password || !role) {
    return res.status(400).json({ 
      error: 'Missing required fields',
      details: 'Name, email, password, and role are required'
    });
  }

  // First check if email already exists
  db.query('SELECT id FROM employee WHERE email = ?', [email], (err, results) => {
    if (err) {
      console.error('Database error while checking email:', err);
      return res.status(500).json({ 
        error: 'Error checking email',
        details: err.message 
      });
    }

    if (results.length > 0) {
      return res.status(400).json({ 
        error: 'Email already exists',
        details: 'An employee with this email address already exists'
      });
    }

    // If email doesn't exist, proceed with insertion
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
});

// 5. DELETE employee
router.delete('/:id', (req, res) => {
  const employeeId = req.params.id;
  if (!employeeId) {
    return res.status(400).json({ error: 'Employee ID is required' });
  }

  const query = 'DELETE FROM employee WHERE id = ?';
  db.query(query, [employeeId], (err, result) => {
    if (err) {
      console.error('Error deleting employee:', err);
      return res.status(500).json({ error: 'Error deleting employee' });
    }
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    
    res.json({ message: 'Employee deleted successfully' });
  });
});

module.exports = router;