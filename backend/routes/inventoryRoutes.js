const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { body, validationResult } = require('express-validator');

// Basic validation middleware
const validateInventoryInput = [
  body('stock_id').notEmpty().trim(),
  body('stock_name').notEmpty().trim(),
  body('category_id').isInt(),
  body('quantity').isFloat({ min: 0 }),
  body('threshold').isFloat({ min: 0 }),
  body('unit').isIn(['kg', 'liters', 'units', 'pieces', 'tablespoons', 'g', 'ml', 'teaspoons']),
];

// GET all inventory items
router.get('/', async (req, res) => {
  try {
    const query = `
      SELECT 
        i.id, i.stock_id, i.stock_name, i.category_id, i.unit, i.supplier,
        COALESCE(SUM(id.remaining_quantity), 0) AS remaining_quantity,
        COALESCE(SUM(id.quantity), 0) AS initial_quantity,
        MIN(id.expiration_date) AS expiration_date,
        MIN(id.delivery_date) AS delivery_date,
        CASE 
          WHEN COALESCE(SUM(id.remaining_quantity), 0) = 0 THEN 'Out of Stock'
          WHEN COALESCE(SUM(id.remaining_quantity), 0) <= i.threshold THEN 'Restock'
          ELSE 'Available'
        END AS status
      FROM inventory i
      LEFT JOIN inventory_details id ON i.id = id.inventory_id
      WHERE i.archive = 0
      GROUP BY i.id, i.stock_id, i.stock_name, i.category_id, i.unit, i.supplier
    `;

    db.query(query, (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET specific inventory by ID
router.get('/:id', async (req, res) => {
  try {
    const query = `
      SELECT 
        i.*, 
        id.remaining_quantity, 
        id.quantity, 
        id.delivery_date, 
        id.expiration_date 
      FROM inventory i
      LEFT JOIN inventory_details id ON i.id = id.inventory_id
      WHERE i.id = ?
    `;

    db.query(query, [req.params.id], (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!results.length) return res.status(404).json({ error: 'Stock not found' });
      res.json(results[0]);
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add new stock
router.post('/', validateInventoryInput, (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { stock_id, stock_name, category_id, quantity, unit, delivery_date, expiration_date, threshold } = req.body;

  db.beginTransaction(err => {
    if (err) return res.status(500).json({ error: err.message });

    const insertInventory = `
      INSERT INTO inventory (stock_id, stock_name, category_id, unit, threshold)
      VALUES (?, ?, ?, ?, ?)
    `;

    db.query(insertInventory, [stock_id, stock_name, category_id, unit, threshold], (err, result) => {
      if (err) return db.rollback(() => res.status(500).json({ error: err.message }));

      const inventoryId = result.insertId;
      const insertDetails = `
        INSERT INTO inventory_details (inventory_id, delivery_date, quantity, remaining_quantity, unit, expiration_date)
        VALUES (?, ?, ?, ?, ?, ?)
      `;

      db.query(insertDetails, [inventoryId, delivery_date, quantity, quantity, unit, expiration_date], (err) => {
        if (err) return db.rollback(() => res.status(500).json({ error: err.message }));

        db.commit(err => {
          if (err) return db.rollback(() => res.status(500).json({ error: err.message }));
          res.status(201).json({ message: 'Stock added successfully' });
        });
      });
    });
  });
});

router.get('/inventory/history', async (req, res) => {
  try {
    // Query the inventory_details table
    const query = `
      SELECT 
        id,
        inventory_id,
        delivery_date,
        quantity,
        remaining_quantity,
        expiration_date,
        unit
      FROM inventory_details
      ORDER BY delivery_date DESC
    `;

    const [results] = await db.query(query);

    if (!results || results.length === 0) {
      return res.status(404).json({ error: "Stock not found" });
    }

    return res.status(200).json(results);

  } catch (error) {
    console.error('Error fetching stock history:', error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
