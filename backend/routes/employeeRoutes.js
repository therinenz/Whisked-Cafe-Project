const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Single middleware for logging requests
router.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});

// 1. GET all employees
router.get('/', (req, res) => {
  const query = `
    SELECT id, name, email, mobile, role, created_at, last_logged_in, updated_at 
    FROM employee
  `;
  
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error fetching employees' });
    }
    res.json(results);
  });
});

// 2. GET roles (must come before /:id)
router.get('/roles', (req, res) => {
  const query = `SHOW COLUMNS FROM employee WHERE Field = 'role'`;
  
  db.query(query, (err, results) => {
    if (err) {
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
      res.status(500).json({ error: 'Error parsing role values' });
    }
  });
});

// 3. GET single employee by ID
router.get('/:id', (req, res) => {
  const employeeId = req.params.id;

  if (isNaN(employeeId)) {
    return res.status(400).json({ error: 'Invalid employee ID format' });
  }

  const query = `SELECT * FROM employee WHERE id = ?`;

  db.query(query, [employeeId], (err, results) => {
    if (err) {
      return res.status(500).json({ 
        error: 'Database error', 
        details: err.message 
      });
    }

    if (!results || results.length === 0) {
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
  
  if (!name || !email || !password || !role) {
    return res.status(400).json({ 
      error: 'Missing required fields',
      details: 'Name, email, password, and role are required'
    });
  }

  db.query('SELECT id FROM employee WHERE email = ?', [email], (err, results) => {
    if (err) {
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

    const query = `
      INSERT INTO employee (name, email, password, mobile, role) 
      VALUES (?, ?, ?, ?, ?)
    `;
    
    db.query(query, [name, email, password, mobile, role], (err, result) => {
      if (err) {
        return res.status(500).json({ 
          error: 'Error adding employee',
          details: err.message 
        });
      }
      
      db.query('SELECT * FROM employee WHERE id = ?', [result.insertId], (err, results) => {
        if (err) {
          return res.status(500).json({ 
            error: 'Error fetching new employee',
            details: err.message 
          });
        }
        
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
      return res.status(500).json({ error: 'Error deleting employee' });
    }
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    
    res.json({ message: 'Employee deleted successfully' });
  });
});

// 6. PUT (Update) employee
router.put('/:id', (req, res) => {
  const employeeId = req.params.id;
  const { name, email, mobile, role, password } = req.body;

  if (isNaN(employeeId)) {
    return res.status(400).json({ 
      error: 'Invalid ID format',
      details: 'Employee ID must be a number'
    });
  }

  if (!name && !email && !mobile && !role && !password) {
    return res.status(400).json({ 
      error: 'No update data',
      details: 'At least one field (name, email, mobile, password, or role) must be provided for update'
    });
  }

  let updateFields = [];
  let queryParams = [];

  if (name) {
    updateFields.push('name = ?');
    queryParams.push(name);
  }
  if (email) {
    updateFields.push('email = ?');
    queryParams.push(email);
  }
  if (mobile) {
    updateFields.push('mobile = ?');
    queryParams.push(mobile);
  }
  if (role) {
    updateFields.push('role = ?');
    queryParams.push(role);
  }
  if (password) {
    updateFields.push('password = ?');
    queryParams.push(password);
  }

  updateFields.push('updated_at = CURRENT_TIMESTAMP');
  queryParams.push(employeeId);

  const query = `
    UPDATE employee 
    SET ${updateFields.join(', ')}
    WHERE id = ?
  `;

  function executeUpdate() {
    db.query(query, queryParams, (err, result) => {
      if (err) {
        return res.status(500).json({ 
          error: 'Error updating employee',
          details: err.message 
        });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ 
          error: 'Employee not found',
          details: `No employee exists with ID ${employeeId}`
        });
      }

      db.query('SELECT * FROM employee WHERE id = ?', [employeeId], (err, results) => {
        if (err) {
          return res.status(500).json({ 
            error: 'Error fetching updated employee',
            details: err.message 
          });
        }

        res.json(results[0]);
      });
    });
  }

  if (email) {
    db.query('SELECT id FROM employee WHERE email = ? AND id != ?', [email, employeeId], (err, results) => {
      if (err) {
        return res.status(500).json({ 
          error: 'Error checking email',
          details: err.message 
        });
      }

      if (results.length > 0) {
        return res.status(400).json({ 
          error: 'Email already exists',
          details: 'This email is already registered to another employee'
        });
      }

      executeUpdate();
    });
  } else {
    executeUpdate();
  }
});

module.exports = router;