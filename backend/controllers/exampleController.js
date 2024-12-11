const db = require('../config/db');

exports.getExample = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM example_table');
    res.status(200).json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database query failed' });
  }
};