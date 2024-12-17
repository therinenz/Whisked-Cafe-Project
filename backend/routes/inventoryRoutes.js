const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { body, validationResult } = require('express-validator');

// Single middleware for logging requests
router.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});

// Validation middleware
const validateInventoryInput = [
  body('stock_id').notEmpty().trim(),
  body('stock_name').notEmpty().trim(),
  body('category_id').isInt(),
  body('quantity').isFloat({ min: 0 }),
  body('threshold').isFloat({ min: 0 }),
  body('unit').isIn(['kg', 'liters', 'units', 'pieces']),
  body('supplier').notEmpty().trim(),
];

// 1. GET all inventory items
router.get('/', async (req, res) => {
  try {
    const query = `
      SELECT 
        i.id,
        i.stock_id,
        i.stock_name,
        i.supplier,
        c.name as category_name,
        COALESCE(SUM(id.remaining_quantity), 0) AS remaining_quantity,
        COALESCE(SUM(id.quantity), 0) AS initial_quantity,
        MIN(id.expiration_date) AS expiration_date,
        CASE 
            WHEN COALESCE(SUM(id.remaining_quantity), 0) = 0 THEN 'Out of Stock'
            WHEN COALESCE(SUM(id.remaining_quantity), 0) <= i.threshold THEN 'Restock'
            ELSE 'Available'
        END AS status
      FROM inventory i
      LEFT JOIN inventory_details id ON i.id = id.inventory_id
      LEFT JOIN categories c ON i.category_id = c.id
      WHERE i.archive = 0
      GROUP BY i.id, i.stock_id, i.stock_name, i.supplier, c.name;
    `;

    db.query(query, (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      res.json(
        results.map((item) => ({
          id: item.id,
          stock_id: item.stock_id,
          stock_name: item.stock_name,
          supplier: item.supplier,
          category_name: item.category_name,
          quantity: `${item.remaining_quantity} / ${item.initial_quantity}`,
          expiration_date: item.expiration_date || 'N/A',
          status: item.status,
        }))
      );
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2. GET inventory history
router.get('/history', async (req, res) => {
  try {
    const query = `
      SELECT 
        id.id, 
        id.inventory_id, 
        id.quantity, 
        id.remaining_quantity, 
        id.expiration_date, 
        id.delivery_date,
        i.stock_id,
        i.stock_name,
        c.name AS category_name
      FROM inventory_details id
      JOIN inventory i ON i.id = id.inventory_id
      LEFT JOIN categories c ON i.category_id = c.id
      WHERE id.remaining_quantity > 0
      ORDER BY id.delivery_date DESC
    `;

    db.query(query, (err, results) => {
      if (err) {
        console.error('Error fetching inventory history:', err);
        return res.status(500).json({ error: err.message });
      }
      res.json(results);
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 3. GET specific inventory by ID
router.get('/:id', async (req, res) => {
  try {
    const inventoryId = req.params.id;
    const query = `
      SELECT 
        i.id, 
        i.stock_id, 
        i.stock_name,
        i.category_id,
        c.name as category_name,
        i.unit, 
        i.supplier, 
        id.remaining_quantity, 
        id.quantity,
        id.delivery_date, 
        id.expiration_date,
        COALESCE(SUM(id.remaining_quantity), 0) AS total_quantity
      FROM inventory i
      LEFT JOIN inventory_details id ON i.id = id.inventory_id
      LEFT JOIN categories c ON i.category_id = c.id
      WHERE i.id = ?
      GROUP BY i.id, i.stock_id, i.stock_name, i.category_id, c.name, i.unit, i.supplier, 
               id.remaining_quantity, id.quantity, id.delivery_date, id.expiration_date
    `;

    db.query(query, [inventoryId], (err, results) => {
      if (err) {
        console.error('Database error:', err.message);
        return res.status(500).json({ error: 'Database error', details: err.message });
      }

      if (!results || results.length === 0) {
        return res.status(404).json({ error: 'Stock not found' });
      }

      // Simplified transformation
      const transformedResult = {
        ...results[0],
        stock_name: results[0].stock_name,
        category_name: results[0].category_name,
        amount_per_qty: results[0].amount_per_qty || 0,
        quantity: results[0].quantity || 0,
        delivery_date: results[0].delivery_date,
        expiration_date: results[0].expiration_date
      };

      res.json(transformedResult);
    });
  } catch (error) {
    console.error('Error in GET /:id:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// 4. POST new stock
router.post('/', validateInventoryInput, (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { stock_id, stock_name, category_id, quantity, unit, delivery_date, expiration_date, threshold, supplier } = req.body;

  const insertInventory = `
    INSERT INTO inventory (
      stock_id, stock_name, category_id, unit, threshold, supplier
    ) VALUES (?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      stock_name = VALUES(stock_name),
      category_id = VALUES(category_id),
      unit = VALUES(unit),
      threshold = VALUES(threshold),
      supplier = VALUES(supplier)
  `;

  db.beginTransaction(err => {
    if (err) return res.status(500).json({ error: err.message });

    db.query(insertInventory, [stock_id, stock_name, category_id, unit, threshold, supplier], (err, result) => {
      if (err) {
        return db.rollback(() => res.status(500).json({ error: err.message }));
      }

      // Fetch the correct inventory_id (whether newly inserted or updated)
      const getInventoryId = `
        SELECT id FROM inventory WHERE stock_id = ?
      `;

      db.query(getInventoryId, [stock_id], (err, rows) => {
        if (err || rows.length === 0) {
          return db.rollback(() => res.status(500).json({ error: 'Failed to fetch inventory ID' }));
        }

        const inventoryId = rows[0].id; // Use the fetched inventory ID

        const insertDetails = `
          INSERT INTO inventory_details (
            inventory_id, delivery_date, quantity, remaining_quantity, unit, expiration_date
          ) VALUES (?, ?, ?, ?, ?, ?)
        `;

        db.query(insertDetails, [inventoryId, delivery_date, quantity, quantity, unit, expiration_date], (err) => {
          if (err) {
            return db.rollback(() => res.status(500).json({ error: err.message }));
          }

          db.commit(err => {
            if (err) {
              return db.rollback(() => res.status(500).json({ error: err.message }));
            }
            res.status(201).json({ message: 'Stock added successfully' });
          });
        });
      });
    });
  });
});

// 5. POST restock existing inventory
router.post('/:id/restock', (req, res) => {
  const { quantity, delivery_date, expiration_date } = req.body;
  const inventoryId = req.params.id;

  db.beginTransaction(async (err) => {
    if (err) return res.status(500).json({ error: err.message });

    try {
      // 1. Update old stock to "Last Stock"
      await db.query(`
        UPDATE inventory_details 
        SET status = 'Last Stock'
        WHERE inventory_id = ? 
        ORDER BY delivery_date ASC 
        LIMIT 1
      `, [inventoryId]);

      // 2. Add new stock as "Available"
      await db.query(`
        INSERT INTO inventory_details (
          inventory_id, delivery_date, quantity, unit, expiration_date, status
        ) VALUES (?, ?, ?, (SELECT unit FROM inventory WHERE id = ?), ?, 'Available')
      `, [inventoryId, delivery_date, quantity, inventoryId, expiration_date]);

      await db.commit();
      res.json({ message: 'Stock restocked successfully' });
    } catch (error) {
      await db.rollback();
      res.status(500).json({ error: error.message });
    }
  });
});

// 6. POST deduct stock
router.post('/:id/deduct', async (req, res) => {
  const { quantity } = req.body;
  const inventoryId = req.params.id;

  db.beginTransaction(async (err) => {
    if (err) return res.status(500).json({ error: err.message });

    try {
      // Get available batches in FIFO order
      const [batches] = await db.promise().query(`
        SELECT id, remaining_quantity 
        FROM inventory_details 
        WHERE inventory_id = ? 
          AND remaining_quantity > 0 
          AND status != 'Out of Stock'
        ORDER BY delivery_date ASC
      `, [inventoryId]);

      let remainingToDeduct = quantity;
      
      // Deduct from each batch following FIFO
      for (const batch of batches) {
        if (remainingToDeduct <= 0) break;

        const deductAmount = Math.min(batch.remaining_quantity, remainingToDeduct);
        
        await db.promise().query(`
          UPDATE inventory_details 
          SET 
            remaining_quantity = remaining_quantity - ?,
            status = CASE 
              WHEN remaining_quantity - ? <= 0 THEN 'Out of Stock'
              WHEN remaining_quantity - ? <= (
                SELECT threshold FROM inventory WHERE id = ?
              ) THEN 'Last Stock'
              ELSE 'Available'
            END
          WHERE id = ?
        `, [deductAmount, deductAmount, deductAmount, deductAmount, inventoryId, batch.id]);

        remainingToDeduct -= deductAmount;
      }

      if (remainingToDeduct > 0) {
        throw new Error('Insufficient stock available');
      }

      // Update main inventory status
      await db.promise().query(`
        UPDATE inventory i
        SET status = CASE 
          WHEN (SELECT SUM(remaining_quantity) FROM inventory_details WHERE inventory_id = ?) <= 0 
            THEN 'Out of Stock'
          WHEN (SELECT SUM(remaining_quantity) FROM inventory_details WHERE inventory_id = ?) <= i.threshold 
            THEN 'Restock'
          ELSE 'Available'
        END
        WHERE id = ?
      `, [inventoryId, inventoryId, inventoryId]);

      await db.commit();
      res.json({ message: 'Stock deducted successfully' });

    } catch (error) {
      await db.rollback();
      res.status(500).json({ error: error.message });
    }
  });
});

// 7. POST deduct from sale
router.post('/deduct-from-sale', async (req, res) => {
  const { items } = req.body; // items = [{ stock_id, quantity }]

  db.beginTransaction(async (err) => {
    if (err) return res.status(500).json({ error: err.message });

    try {
      // Process each item in the sale
      for (const item of items) {
        const { stock_id, quantity } = item;
        
        // Get the inventory ID from stock_id
        const [inventory] = await db.promise().query(
          'SELECT id, threshold FROM inventory WHERE stock_id = ?', 
          [stock_id]
        );

        if (!inventory.length) {
          throw new Error(`Stock ${stock_id} not found`);
        }

        const inventoryId = inventory[0].id;

        // Get available batches in FIFO order
        const [batches] = await db.promise().query(`
          SELECT id, remaining_quantity 
          FROM inventory_details 
          WHERE inventory_id = ? 
            AND remaining_quantity > 0 
            AND status != 'Out of Stock'
          ORDER BY delivery_date ASC
        `, [inventoryId]);

        let remainingToDeduct = quantity;
        
        // Deduct from each batch following FIFO
        for (const batch of batches) {
          if (remainingToDeduct <= 0) break;

          const deductAmount = Math.min(batch.remaining_quantity, remainingToDeduct);
          
          await db.promise().query(`
            UPDATE inventory_details 
            SET 
              remaining_quantity = remaining_quantity - ?,
              status = CASE 
                WHEN remaining_quantity - ? <= 0 THEN 'Out of Stock'
                WHEN remaining_quantity - ? <= (
                  SELECT threshold FROM inventory WHERE id = ?
                ) THEN 'Last Stock'
                ELSE 'Available'
              END
            WHERE id = ?
          `, [deductAmount, deductAmount, deductAmount, deductAmount, inventoryId, batch.id]);

          remainingToDeduct -= deductAmount;
        }

        if (remainingToDeduct > 0) {
          throw new Error(`Insufficient stock for ${stock_id}`);
        }

        // Update main inventory status
        await db.promise().query(`
          UPDATE inventory i
          SET status = CASE 
            WHEN (SELECT SUM(remaining_quantity) FROM inventory_details WHERE inventory_id = ?) <= 0 
              THEN 'Out of Stock'
            WHEN (SELECT SUM(remaining_quantity) FROM inventory_details WHERE inventory_id = ?) <= i.threshold 
              THEN 'Restock'
            ELSE 'Available'
          END
          WHERE id = ?
        `, [inventoryId, inventoryId, inventoryId]);
      }

      await db.commit();
      res.json({ message: 'Stock deducted successfully from sale' });

    } catch (error) {
      await db.rollback();
      res.status(500).json({ error: error.message });
    }
  });
});

// 8. PUT archive inventory
router.put('/:id/archive', (req, res) => {
  const query = `
    UPDATE inventory 
    SET archive = 1 
    WHERE id = ?
  `;

  db.query(query, [req.params.id], (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Inventory archived successfully' });
  });
});

// 9. DELETE cleanup empty stocks
router.delete('/cleanup-empty-stocks', async (req, res) => {
  try {
      const query = `
          DELETE FROM inventory_details 
          WHERE remaining_quantity <= 0 
          AND status = 'Last Stock'
      `;

      db.query(query, (err, results) => {
          if (err) {
              return res.status(500).json({ error: err.message });
          }
          res.json({ message: 'Empty stocks cleaned up' });
      });
  } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
  }
});

// Error handling middleware
router.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Catch-all route (must be last)
router.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.originalUrl} not found`
  });
});

module.exports = router;
