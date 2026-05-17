const express = require('express');
module.exports = (db) => {
  const router = express.Router();

  // SELECT example: get components (optionally by category)
  router.get('/select/components', (req, res) => {
    const { category } = req.query;
    const sql = category ? 'SELECT * FROM components WHERE category = ?' : 'SELECT * FROM components LIMIT 100';
    const params = category ? [category] : [];
    db.query(sql, params, (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    });
  });

  // INSERT example (uses transaction)
  router.post('/insert/component', (req, res) => {
    const { category, brand, model, price, watt } = req.body;
    db.beginTransaction(err => {
      if (err) return res.status(500).json({ error: err.message });
      const sql = 'INSERT INTO components (category, brand, model, price, watt) VALUES (?, ?, ?, ?, ?)';
      db.query(sql, [category, brand, model, price || 0, watt || null], (err, result) => {
        if (err) return db.rollback(() => res.status(500).json({ error: err.message }));
        db.commit(commitErr => {
          if (commitErr) return db.rollback(() => res.status(500).json({ error: commitErr.message }));
          res.json({ insertedId: result.insertId });
        });
      });
    });
  });

  // UPDATE example
  router.put('/update/component/:id', (req, res) => {
    const id = req.params.id;
    const { price, stock_status } = req.body;
    const sql = 'UPDATE components SET price = ?, stock_status = ? WHERE id = ?';
    db.query(sql, [price, stock_status, id], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ affectedRows: result.affectedRows });
    });
  });

  // DELETE example
  router.delete('/delete/component/:id', (req, res) => {
    const id = req.params.id;
    const sql = 'DELETE FROM components WHERE id = ?';
    db.query(sql, [id], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ affectedRows: result.affectedRows });
    });
  });

  // AGGREGATE example
  router.get('/aggregate/avg-price/:category', (req, res) => {
    const category = req.params.category;
    const sql = 'SELECT AVG(price) AS avg_price, COUNT(*) AS count FROM components WHERE category = ?';
    db.query(sql, [category], (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows[0]);
    });
  });

  // JOIN example: builds with users
  router.get('/join/builds-users', (req, res) => {
    const sql = `SELECT b.id AS build_id, b.total_price, u.user_name, u.email
                 FROM builds b
                 JOIN users u ON b.user_id = u.id
                 ORDER BY b.created_at DESC LIMIT 100`;
    db.query(sql, (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    });
  });

  // SUBQUERY example: components that appear in builds more than N times
  router.get('/subquery/popular-components/:minCount', (req, res) => {
    const minCount = parseInt(req.params.minCount || '2', 10);
    const sql = `SELECT c.*, (SELECT COUNT(*) FROM build_components bc WHERE bc.component_id = c.id) AS used_count
                 FROM components c
                 WHERE (SELECT COUNT(*) FROM build_components bc WHERE bc.component_id = c.id) >= ?`;
    db.query(sql, [minCount], (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    });
  });

  return router;
};
