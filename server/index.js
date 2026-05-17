const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const fs = require('fs')
const path = require('path')
const {
  ensureDb,
  hashPassword,
  verifyPassword,
  normalizeEmail,
  parseJsonColumn,
} = require('./db')
const smartBuilderRoutes = require('./smartBuilder')

const app = express()
app.use(cors())
app.use(bodyParser.json())

// Simple request logger
app.use((req, res, next) => {
  console.log(new Date().toISOString(), req.method, req.url)
  next()
})

const db = ensureDb()
app.use('/smart/builder', smartBuilderRoutes(db))

// Serve frontend static files if a production build exists in ../dist
const distPath = path.join(__dirname, '..', 'dist')
if (fs.existsSync(distPath)) {
    // Serve the built files both at root and the Project-alpha base path so
    // asset URLs with or without the /Project-alpha prefix resolve correctly.
    const mountPath = '/Project-alpha'
    const staticOptions = {
      setHeaders(res, filePath) {
        console.log('Static serve:', filePath)
      },
    }

    app.use('/', express.static(distPath, staticOptions))
    app.use(mountPath, express.static(distPath, staticOptions))

    // SPA fallback: serve index.html for non-API routes so client-side routing works.
    app.get('*', (req, res, next) => {
      if (req.path.startsWith('/api')) return next()
      res.sendFile(path.join(distPath, 'index.html'))
    })
} else {
  // Helpful root route during development when frontend is served separately
  app.get('/', (req, res) => {
    res.send('API server running. Start the frontend (Vite) separately or build the project and place files in /dist')
  })
}

app.get('/api/health', (req, res) => res.json({ ok: true }))

app.get('/api/db-status', (req, res) => {
  db.get('SELECT 1 AS ok', (err, row) => {
    if (err) {
      return res.status(500).json({ connected: false, error: err.message })
    }
    res.json({ connected: true, result: row?.ok === 1 })
  })
})

app.post('/api/auth/signup', (req, res) => {
  const userName = String(req.body.user_name || req.body.name || '').trim()
  const email = normalizeEmail(req.body.email)
  const password = String(req.body.password || '')
  const preferences = String(req.body.preferences || '').trim() || null

  if (!userName || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required' })
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' })
  }

  db.get('SELECT user_id FROM users WHERE email = ?', [email], (findErr, existing) => {
    if (findErr) return res.status(500).json({ error: findErr.message })
    if (existing) return res.status(409).json({ error: 'Email already registered' })

    const passwordHash = hashPassword(password)
    const stmt = db.prepare(
      'INSERT INTO users (user_name, email, password_hash, preferences) VALUES (?, ?, ?, ?)'
    )

    stmt.run(userName, email, passwordHash, preferences, function (insertErr) {
      if (insertErr) return res.status(500).json({ error: insertErr.message })

      db.get('SELECT user_id, user_name, email, preferences, created_at FROM users WHERE user_id = ?', [
        this.lastID,
      ], (fetchErr, row) => {
        if (fetchErr) return res.status(500).json({ error: fetchErr.message })
        res.status(201).json({ user: row })
      })
    })
  })
})

app.post('/api/auth/login', (req, res) => {
  const email = normalizeEmail(req.body.email)
  const password = String(req.body.password || '')

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' })
  }

  db.get(
    'SELECT user_id, user_name, email, password_hash, preferences, created_at FROM users WHERE email = ?',
    [email],
    (err, user) => {
      if (err) return res.status(500).json({ error: err.message })
      if (!user || !verifyPassword(password, user.password_hash)) {
        return res.status(401).json({ error: 'Invalid email or password' })
      }

      db.run('UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE user_id = ?', [user.user_id])
      delete user.password_hash
      res.json({ user })
    }
  )
})

app.get('/api/parts', (req, res) => {
  const category = req.query.category ? String(req.query.category).trim() : ''
  const params = []
  let sql = 'SELECT * FROM pc_parts'

  if (category) {
    sql += ' WHERE category = ?'
    params.push(category)
  }

  sql += ' ORDER BY category ASC, part_name ASC'

  db.all(sql, params, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message })
    const parsed = rows.map((row) => ({ ...row, specs: parseJsonColumn(row.specs_json, {}) }))
    res.json(parsed)
  })
})

app.get('/api/parts/:id', (req, res) => {
  db.get('SELECT * FROM pc_parts WHERE part_id = ?', [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message })
    if (!row) return res.status(404).json({ error: 'Part not found' })
    res.json({ ...row, specs: parseJsonColumn(row.specs_json, {}) })
  })
})

app.post('/api/parts', (req, res) => {
  const category = String(req.body.category || '').trim()
  const partName = String(req.body.part_name || req.body.name || '').trim()
  const brand = String(req.body.brand || '').trim() || null
  const model = String(req.body.model || '').trim() || null
  const price = Number(req.body.price)
  const watt = Number(req.body.watt || 0)
  const stockStatus = String(req.body.stock_status || 'In Stock').trim() || 'In Stock'
  const specs = req.body.specs || {}

  if (!category || !partName || !Number.isFinite(price)) {
    return res.status(400).json({ error: 'Category, part name, and price are required' })
  }

  const stmt = db.prepare(
    'INSERT INTO pc_parts (category, part_name, brand, model, price, watt, stock_status, specs_json) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
  )

  stmt.run(
    category,
    partName,
    brand,
    model,
    price,
    Number.isFinite(watt) ? watt : 0,
    stockStatus,
    JSON.stringify(specs),
    function (err) {
      if (err) return res.status(500).json({ error: err.message })

      db.get('SELECT * FROM pc_parts WHERE part_id = ?', [this.lastID], (fetchErr, row) => {
        if (fetchErr) return res.status(500).json({ error: fetchErr.message })
        res.status(201).json({ ...row, specs: parseJsonColumn(row.specs_json, {}) })
      })
    }
  )
})

app.put('/api/parts/:id', (req, res) => {
  const category = String(req.body.category || '').trim()
  const partName = String(req.body.part_name || req.body.name || '').trim()
  const brand = String(req.body.brand || '').trim() || null
  const model = String(req.body.model || '').trim() || null
  const price = Number(req.body.price)
  const watt = Number(req.body.watt || 0)
  const stockStatus = String(req.body.stock_status || 'In Stock').trim() || 'In Stock'
  const specs = req.body.specs || {}

  if (!category || !partName || !Number.isFinite(price)) {
    return res.status(400).json({ error: 'Category, part name, and price are required' })
  }

  const stmt = db.prepare(
    'UPDATE pc_parts SET category = ?, part_name = ?, brand = ?, model = ?, price = ?, watt = ?, stock_status = ?, specs_json = ? WHERE part_id = ?'
  )

  stmt.run(
    category,
    partName,
    brand,
    model,
    price,
    Number.isFinite(watt) ? watt : 0,
    stockStatus,
    JSON.stringify(specs),
    req.params.id,
    function (err) {
      if (err) return res.status(500).json({ error: err.message })
      if (this.changes === 0) return res.status(404).json({ error: 'Part not found' })

      db.get('SELECT * FROM pc_parts WHERE part_id = ?', [req.params.id], (fetchErr, row) => {
        if (fetchErr) return res.status(500).json({ error: fetchErr.message })
        res.json({ ...row, specs: parseJsonColumn(row.specs_json, {}) })
      })
    }
  )
})

app.get('/api/stores', (req, res) => {
  db.all('SELECT * FROM stores ORDER BY store_name ASC', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message })
    res.json(rows)
  })
})

app.post('/api/stores', (req, res) => {
  const storeName = String(req.body.store_name || req.body.name || '').trim()
  const storeLocation = String(req.body.store_location || req.body.location || '').trim() || null

  if (!storeName) {
    return res.status(400).json({ error: 'Store name is required' })
  }

  const stmt = db.prepare('INSERT INTO stores (store_name, store_location) VALUES (?, ?)')
  stmt.run(storeName, storeLocation, function (err) {
    if (err) return res.status(500).json({ error: err.message })
    db.get('SELECT * FROM stores WHERE store_id = ?', [this.lastID], (fetchErr, row) => {
      if (fetchErr) return res.status(500).json({ error: fetchErr.message })
      res.status(201).json(row)
    })
  })
})

app.get('/api/store-availability', (req, res) => {
  const sql = `
    SELECT
      sa.*,
      s.store_name,
      s.store_location,
      p.part_name,
      p.category
    FROM store_availability sa
    INNER JOIN stores s ON s.store_id = sa.store_id
    INNER JOIN pc_parts p ON p.part_id = sa.part_id
    ORDER BY s.store_name ASC, p.part_name ASC
  `

  db.all(sql, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message })
    res.json(rows)
  })
})

app.post('/api/store-availability', (req, res) => {
  const storeId = Number(req.body.store_id)
  const partId = Number(req.body.part_id)
  const price = Number(req.body.price)
  const stockStatus = String(req.body.stock_status || 'In Stock').trim() || 'In Stock'

  if (!Number.isFinite(storeId) || !Number.isFinite(partId) || !Number.isFinite(price)) {
    return res.status(400).json({ error: 'Store, part, and price are required' })
  }

  const stmt = db.prepare(
    'INSERT INTO store_availability (store_id, part_id, stock_status, price) VALUES (?, ?, ?, ?) ON CONFLICT(store_id, part_id) DO UPDATE SET stock_status = excluded.stock_status, price = excluded.price'
  )

  stmt.run(storeId, partId, stockStatus, price, function (err) {
    if (err) return res.status(500).json({ error: err.message })
    db.get(
      `
        SELECT
          sa.*,
          s.store_name,
          s.store_location,
          p.part_name,
          p.category
        FROM store_availability sa
        INNER JOIN stores s ON s.store_id = sa.store_id
        INNER JOIN pc_parts p ON p.part_id = sa.part_id
        WHERE sa.store_id = ? AND sa.part_id = ?
      `,
      [storeId, partId],
      (fetchErr, row) => {
        if (fetchErr) return res.status(500).json({ error: fetchErr.message })
        res.status(201).json(row)
      }
    )
  })
})

app.get('/api/builds', (req, res) => {
  db.all('SELECT * FROM builds ORDER BY created_at DESC LIMIT 100', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message })
    const parsed = rows.map((r) => ({ ...r, components: JSON.parse(r.components) }))
    res.json(parsed)
  })
})

app.post('/api/builds', (req, res) => {
  const { name = 'manual', components, total_price, total_watt } = req.body
  if (!components || total_price == null || total_watt == null) {
    return res.status(400).json({ error: 'Missing build data' })
  }

  const stmt = db.prepare('INSERT INTO builds (name, components, total_price, total_watt) VALUES (?, ?, ?, ?)')
  stmt.run(name, JSON.stringify(components), total_price, total_watt, function (err) {
    if (err) return res.status(500).json({ error: err.message })
    db.get('SELECT * FROM builds WHERE id = ?', [this.lastID], (err2, row) => {
      if (err2) return res.status(500).json({ error: err2.message })
      row.components = JSON.parse(row.components)
      res.status(201).json(row)
    })
  })
})

const PORT = process.env.PORT || 4000
app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`)
})
