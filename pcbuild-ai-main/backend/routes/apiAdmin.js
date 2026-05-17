const express = require('express');

module.exports = (db) => {
  const router = express.Router();

  // List parts
  router.get('/parts', (req, res) => {
    db.query('SELECT id, category, brand, model, price, watt, stock_status, specs_json FROM components', (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      const mapped = rows.map(r => ({
        part_id: r.id,
        category: r.category,
        part_name: r.model,
        brand: r.brand,
        model: r.model,
        price: r.price,
        watt: r.watt,
        stock_status: r.stock_status,
        specs: r.specs_json ? JSON.parse(r.specs_json) : null,
      }))
      res.json(mapped)
    })
  })

  // Create part
  router.post('/parts', (req, res) => {
    const p = req.body
    const specsText = p.specs ? JSON.stringify(p.specs) : null
    const sql = 'INSERT INTO components (category, brand, model, price, watt, stock_status, specs_json) VALUES (?, ?, ?, ?, ?, ?, ?)'
    db.query(sql, [p.category, p.brand || null, p.part_name || p.model || null, p.price || 0, p.watt || null, p.stock_status || 'in_stock', specsText], (err, result) => {
      if (err) return res.status(500).json({ error: err.message })
      res.json({ insertedId: result.insertId })
    })
  })

  // Update part
  router.put('/parts/:id', (req, res) => {
    const id = req.params.id
    const p = req.body
    const specsText = p.specs ? JSON.stringify(p.specs) : null
    const sql = 'UPDATE components SET category=?, brand=?, model=?, price=?, watt=?, stock_status=?, specs_json=? WHERE id = ?'
    db.query(sql, [p.category, p.brand || null, p.part_name || p.model || null, p.price || 0, p.watt || null, p.stock_status || 'in_stock', specsText, id], (err, result) => {
      if (err) return res.status(500).json({ error: err.message })
      res.json({ affectedRows: result.affectedRows })
    })
  })

  // Stores
  router.get('/stores', (req, res) => {
    db.query('SELECT id AS store_id, store_name, store_location, created_at FROM stores', (err, rows) => {
      if (err) return res.status(500).json({ error: err.message })
      res.json(rows)
    })
  })

  router.post('/stores', (req, res) => {
    const s = req.body
    db.query('INSERT INTO stores (store_name, store_location) VALUES (?, ?)', [s.store_name, s.store_location || null], (err, result) => {
      if (err) return res.status(500).json({ error: err.message })
      res.json({ insertedId: result.insertId })
    })
  })

  // Store availability (joined view)
  router.get('/store-availability', (req, res) => {
    const sql = `SELECT sa.id AS availability_id, sa.store_id, sa.component_id, sa.price, sa.stock_status, s.store_name, s.store_location, c.model AS part_name, c.category
                 FROM store_availability sa
                 LEFT JOIN stores s ON sa.store_id = s.id
                 LEFT JOIN components c ON sa.component_id = c.id`;
    db.query(sql, (err, rows) => {
      if (err) return res.status(500).json({ error: err.message })
      res.json(rows)
    })
  })

  router.post('/store-availability', (req, res) => {
    const a = req.body
    db.query('INSERT INTO store_availability (store_id, component_id, price, stock_status) VALUES (?, ?, ?, ?)', [a.store_id, a.part_id || a.component_id, a.price || 0, a.stock_status || 'in_stock'], (err, result) => {
      if (err) return res.status(500).json({ error: err.message })
      res.json({ insertedId: result.insertId })
    })
  })

  // Builds endpoints
  router.get('/builds', (req, res) => {
    const sql = `SELECT b.id,
                        b.user_id,
                        b.total_price,
                        b.fps,
                        b.watt,
                        b.created_at,
                        u.user_name,
             COUNT(bc.component_id) AS component_count,
             GROUP_CONCAT(c.model, '|||') AS component_names
                 FROM builds b
                 LEFT JOIN users u ON u.id = b.user_id
                 LEFT JOIN build_components bc ON bc.build_id = b.id
           LEFT JOIN components c ON c.id = bc.component_id
                 GROUP BY b.id
                 ORDER BY b.created_at DESC`;
    db.query(sql, (err, rows) => {
      if (err) return res.status(500).json({ error: err.message })
      res.json(rows.map((row) => ({
        ...row,
        name: `Build #${row.id}${row.user_name ? ` · ${row.user_name}` : ''}`,
        total_watt: row.watt,
        components: row.component_names
          ? row.component_names.split('|||').filter(Boolean).map((label) => ({ label }))
          : [],
      })))
    })
  })

  router.post('/builds', (req, res) => {
    const b = req.body
    // default to first user if none provided to satisfy NOT NULL constraint
    const userId = b.user_id || 1
    // insert build
    db.query('INSERT INTO builds (user_id, total_price, fps, watt) VALUES (?, ?, ?, ?)', [userId, b.total_price || 0, b.fps || null, b.total_watt || b.watt || null], (err, result) => {
      if (err) return res.status(500).json({ error: err.message })
      const buildId = result.insertId
      // optionally insert components mapping
      if (Array.isArray(b.components) && b.components.length) {
        const stmt = 'INSERT INTO build_components (build_id, component_id) VALUES (?, ?)'
        b.components.forEach((c) => {
          try { db.query(stmt, [buildId, c.component_id || c.part_id || null], () => {}) } catch (e) {}
        })
      }
      res.json({ id: buildId })
    })
  })

  return router
}
