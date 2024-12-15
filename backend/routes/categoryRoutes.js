const express = require('express');
const router = express.Router();
const db = require('../config/db');
// GET all categories
router.get('/', (req, res) => {
  const query = 'SELECT * FROM categories WHERE 1';
  
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

module.exports = router;