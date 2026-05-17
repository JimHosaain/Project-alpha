const fs = require('fs')
const path = require('path')
const crypto = require('crypto')
const sqlite3 = require('sqlite3').verbose()

const DB_PATH = path.join(__dirname, '..', 'db', 'app.db')
const SCHEMA_PATH = path.join(__dirname, '..', 'db', 'schema.sql')
const PROJECT_ALPHA_SQL_PATH = path.join(__dirname, '..', 'project_alpha.sql')

const PASSWORD_ALGO = 'pbkdf2_sha512'
const PASSWORD_ITERATIONS = 120000
const PASSWORD_KEYLEN = 64
const PASSWORD_DIGEST = 'sha512'
const DEMO_SEED_KEY = 'smart-demo-v1'

const demoStores = [
  { store_name: 'Star Tech', store_location: 'Dhaka' },
  { store_name: 'Ryans', store_location: 'Dhaka' },
  { store_name: 'TechLand', store_location: 'Chattogram' },
]

const demoParts = [
  {
    category: 'CPU',
    part_name: 'Core i5-12400F',
    brand: 'Intel',
    model: '12400F',
    price: 17500,
    watt: 65,
    stock_status: 'In Stock',
    specs: { socket: 'LGA1700', cores: 6, threads: 12, generation: '12th Gen' },
  },
  {
    category: 'CPU',
    part_name: 'Core i5-13400F',
    brand: 'Intel',
    model: '13400F',
    price: 21900,
    watt: 65,
    stock_status: 'In Stock',
    specs: { socket: 'LGA1700', cores: 10, threads: 16, generation: '13th Gen' },
  },
  {
    category: 'CPU',
    part_name: 'Core i3-14100F',
    brand: 'Intel',
    model: '14100F',
    price: 11800,
    watt: 58,
    stock_status: 'In Stock',
    specs: { socket: 'LGA1700', cores: 4, threads: 8, generation: '14th Gen' },
  },
  {
    category: 'CPU',
    part_name: 'Ryzen 5 5600',
    brand: 'AMD',
    model: '5600',
    price: 16200,
    watt: 65,
    stock_status: 'In Stock',
    specs: { socket: 'AM4', cores: 6, threads: 12, generation: 'Zen 3' },
  },
  {
    category: 'CPU',
    part_name: 'Ryzen 5 7600',
    brand: 'AMD',
    model: '7600',
    price: 25500,
    watt: 65,
    stock_status: 'In Stock',
    specs: { socket: 'AM5', cores: 6, threads: 12, generation: 'Zen 4' },
  },
  {
    category: 'GPU',
    part_name: 'RTX 3050 6GB',
    brand: 'NVIDIA',
    model: 'RTX 3050',
    price: 24500,
    watt: 70,
    stock_status: 'In Stock',
    specs: { vram_gb: 6, gpu_length_mm: 230 },
  },
  {
    category: 'GPU',
    part_name: 'RTX 4060 8GB',
    brand: 'NVIDIA',
    model: 'RTX 4060',
    price: 39800,
    watt: 115,
    stock_status: 'In Stock',
    specs: { vram_gb: 8, gpu_length_mm: 225 },
  },
  {
    category: 'GPU',
    part_name: 'RTX 4070 12GB',
    brand: 'NVIDIA',
    model: 'RTX 4070',
    price: 69500,
    watt: 200,
    stock_status: 'In Stock',
    specs: { vram_gb: 12, gpu_length_mm: 267 },
  },
  {
    category: 'GPU',
    part_name: 'RX 6600 8GB',
    brand: 'AMD',
    model: 'RX 6600',
    price: 28500,
    watt: 132,
    stock_status: 'In Stock',
    specs: { vram_gb: 8, gpu_length_mm: 240 },
  },
  {
    category: 'GPU',
    part_name: 'Arc A750 8GB',
    brand: 'Intel',
    model: 'Arc A750',
    price: 26500,
    watt: 225,
    stock_status: 'In Stock',
    specs: { vram_gb: 8, gpu_length_mm: 267 },
  },
  {
    category: 'Motherboard',
    part_name: 'TUF B550-PLUS',
    brand: 'ASUS',
    model: 'TUF B550-PLUS',
    price: 18500,
    watt: 35,
    stock_status: 'In Stock',
    specs: { socket: 'AM4', ram_type: 'DDR4', form_factor: 'ATX' },
  },
  {
    category: 'Motherboard',
    part_name: 'B550M PRO-VDH',
    brand: 'MSI',
    model: 'B550M PRO-VDH',
    price: 14800,
    watt: 30,
    stock_status: 'In Stock',
    specs: { socket: 'AM4', ram_type: 'DDR4', form_factor: 'mATX' },
  },
  {
    category: 'Motherboard',
    part_name: 'B650M DS3H',
    brand: 'Gigabyte',
    model: 'B650M DS3H',
    price: 22500,
    watt: 38,
    stock_status: 'In Stock',
    specs: { socket: 'AM5', ram_type: 'DDR5', form_factor: 'mATX' },
  },
  {
    category: 'Motherboard',
    part_name: 'Prime Z790-P',
    brand: 'ASUS',
    model: 'Prime Z790-P',
    price: 34800,
    watt: 40,
    stock_status: 'In Stock',
    specs: { socket: 'LGA1700', ram_type: 'DDR5', form_factor: 'ATX' },
  },
  {
    category: 'Motherboard',
    part_name: 'B760M-HDV/M.2',
    brand: 'ASRock',
    model: 'B760M-HDV/M.2',
    price: 13800,
    watt: 30,
    stock_status: 'In Stock',
    specs: { socket: 'LGA1700', ram_type: 'DDR4', form_factor: 'mATX' },
  },
  {
    category: 'RAM',
    part_name: 'Vengeance 16GB DDR4 3200',
    brand: 'Corsair',
    model: 'Vengeance 16GB',
    price: 5800,
    watt: 5,
    stock_status: 'In Stock',
    specs: { ram_type: 'DDR4', capacity_gb: 16, speed_mhz: 3200 },
  },
  {
    category: 'RAM',
    part_name: 'Vengeance 32GB DDR4 3200',
    brand: 'Corsair',
    model: 'Vengeance 32GB',
    price: 9800,
    watt: 6,
    stock_status: 'In Stock',
    specs: { ram_type: 'DDR4', capacity_gb: 32, speed_mhz: 3200 },
  },
  {
    category: 'RAM',
    part_name: 'Ripjaws S5 32GB DDR5 5600',
    brand: 'G.Skill',
    model: 'Ripjaws S5 32GB',
    price: 11700,
    watt: 6,
    stock_status: 'In Stock',
    specs: { ram_type: 'DDR5', capacity_gb: 32, speed_mhz: 5600 },
  },
  {
    category: 'RAM',
    part_name: 'T-Force Delta 32GB DDR5 6400',
    brand: 'TeamGroup',
    model: 'T-Force Delta 32GB',
    price: 14100,
    watt: 6,
    stock_status: 'In Stock',
    specs: { ram_type: 'DDR5', capacity_gb: 32, speed_mhz: 6400 },
  },
  {
    category: 'RAM',
    part_name: 'XPG Lancer 16GB DDR5 5600',
    brand: 'Adata',
    model: 'XPG Lancer 16GB',
    price: 6900,
    watt: 5,
    stock_status: 'In Stock',
    specs: { ram_type: 'DDR5', capacity_gb: 16, speed_mhz: 5600 },
  },
  {
    category: 'PSU',
    part_name: 'RM650e',
    brand: 'Corsair',
    model: 'RM650e',
    price: 10800,
    watt: 650,
    stock_status: 'In Stock',
    specs: { efficiency_rating: '80+ Gold' },
  },
  {
    category: 'PSU',
    part_name: 'RM750e',
    brand: 'Corsair',
    model: 'RM750e',
    price: 13800,
    watt: 750,
    stock_status: 'In Stock',
    specs: { efficiency_rating: '80+ Gold' },
  },
  {
    category: 'PSU',
    part_name: 'Focus GX-850',
    brand: 'Seasonic',
    model: 'Focus GX-850',
    price: 17200,
    watt: 850,
    stock_status: 'Limited',
    specs: { efficiency_rating: '80+ Gold' },
  },
  {
    category: 'Case',
    part_name: 'Lancool 216',
    brand: 'Lian Li',
    model: 'Lancool 216',
    price: 13500,
    watt: 0,
    stock_status: 'In Stock',
    specs: { supported_gpu_length_mm: 392, motherboard_support: 'ATX,mATX,Mini-ITX' },
  },
  {
    category: 'Case',
    part_name: 'H5 Flow',
    brand: 'NZXT',
    model: 'H5 Flow',
    price: 14900,
    watt: 0,
    stock_status: 'In Stock',
    specs: { supported_gpu_length_mm: 365, motherboard_support: 'ATX,mATX,Mini-ITX' },
  },
  {
    category: 'Case',
    part_name: 'X3 Mesh',
    brand: 'Montech',
    model: 'X3 Mesh',
    price: 6900,
    watt: 0,
    stock_status: 'In Stock',
    specs: { supported_gpu_length_mm: 305, motherboard_support: 'ATX,mATX,Mini-ITX' },
  },
  {
    category: 'Storage',
    part_name: '970 EVO Plus 500GB',
    brand: 'Samsung',
    model: '970 EVO Plus 500GB',
    price: 5200,
    watt: 4,
    stock_status: 'In Stock',
    specs: { storage_type: 'SSD', interface: 'NVMe', capacity_gb: 500 },
  },
  {
    category: 'Storage',
    part_name: '990 PRO 1TB',
    brand: 'Samsung',
    model: '990 PRO 1TB',
    price: 13200,
    watt: 5,
    stock_status: 'In Stock',
    specs: { storage_type: 'SSD', interface: 'NVMe', capacity_gb: 1000 },
  },
  {
    category: 'Storage',
    part_name: 'Barracuda 2TB',
    brand: 'Seagate',
    model: 'Barracuda 2TB',
    price: 7600,
    watt: 8,
    stock_status: 'In Stock',
    specs: { storage_type: 'HDD', interface: 'SATA', capacity_gb: 2000 },
  },
]

function runAsync(db, sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) return reject(err)
      resolve({ lastID: this.lastID, changes: this.changes })
    })
  })
}

function getAsync(db, sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => (err ? reject(err) : resolve(row)))
  })
}

function allAsync(db, sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => (err ? reject(err) : resolve(rows || [])))
  })
}

async function seedDemoInventory(db) {
  await runAsync(
    db,
    'CREATE TABLE IF NOT EXISTS demo_seed_meta (seed_key TEXT PRIMARY KEY, applied_at DATETIME DEFAULT CURRENT_TIMESTAMP)'
  )

  const seedMarker = await getAsync(db, 'SELECT seed_key FROM demo_seed_meta WHERE seed_key = ?', [DEMO_SEED_KEY])
  if (seedMarker) {
    return
  }

  for (const store of demoStores) {
    const existingStore = await getAsync(db, 'SELECT store_id FROM stores WHERE LOWER(store_name) = LOWER(?)', [
      store.store_name,
    ])
    if (!existingStore) {
      await runAsync(db, 'INSERT INTO stores (store_name, store_location) VALUES (?, ?)', [
        store.store_name,
        store.store_location,
      ])
    }
  }

  const seededParts = []
  for (const part of demoParts) {
    const existingPart = await getAsync(
      db,
      'SELECT part_id FROM pc_parts WHERE LOWER(category) = LOWER(?) AND LOWER(part_name) = LOWER(?)',
      [part.category, part.part_name]
    )

    if (existingPart) {
      seededParts.push({ ...part, part_id: existingPart.part_id })
      continue
    }

    const insertResult = await runAsync(
      db,
      'INSERT INTO pc_parts (category, part_name, brand, model, price, watt, stock_status, specs_json) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [part.category, part.part_name, part.brand, part.model, part.price, part.watt, part.stock_status, JSON.stringify(part.specs)]
    )
    seededParts.push({ ...part, part_id: insertResult.lastID })
  }

  const stores = await allAsync(db, 'SELECT store_id, store_name FROM stores ORDER BY store_name ASC')
  for (let index = 0; index < stores.length; index += 1) {
    const store = stores[index]
    for (const part of seededParts) {
      const priceShift = 1 + index * 0.018
      const adjustedPrice = Math.round(Number(part.price) * priceShift + (part.category === 'GPU' ? index * 250 : 0))
      const stockStatus = index === 1 && part.category !== 'Case' ? 'Limited' : 'In Stock'

      await runAsync(
        db,
        'INSERT OR REPLACE INTO store_availability (store_id, part_id, stock_status, price) VALUES (?, ?, ?, ?)',
        [store.store_id, part.part_id, stockStatus, adjustedPrice]
      )
    }
  }

  await runAsync(db, 'INSERT INTO demo_seed_meta (seed_key) VALUES (?)', [DEMO_SEED_KEY])
  console.log(`Seeded demo inventory with ${seededParts.length} parts and ${stores.length} stores`)
}

function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase()
}

function hashPassword(password, salt = crypto.randomBytes(16).toString('hex')) {
  const derived = crypto
    .pbkdf2Sync(String(password), salt, PASSWORD_ITERATIONS, PASSWORD_KEYLEN, PASSWORD_DIGEST)
    .toString('hex')

  return `${PASSWORD_ALGO}$${PASSWORD_ITERATIONS}$${salt}$${derived}`
}

function verifyPassword(password, storedHash) {
  if (!storedHash || typeof storedHash !== 'string') return false

  const parts = storedHash.split('$')
  if (parts.length !== 4 || parts[0] !== PASSWORD_ALGO) return false

  const iterations = Number(parts[1])
  const salt = parts[2]
  const expectedHex = parts[3]

  if (!Number.isFinite(iterations) || !salt || !expectedHex) return false

  const actualHex = crypto
    .pbkdf2Sync(String(password), salt, iterations, PASSWORD_KEYLEN, PASSWORD_DIGEST)
    .toString('hex')

  const actualBuffer = Buffer.from(actualHex, 'hex')
  const expectedBuffer = Buffer.from(expectedHex, 'hex')

  if (actualBuffer.length !== expectedBuffer.length) return false
  return crypto.timingSafeEqual(actualBuffer, expectedBuffer)
}

function seedBuildsFromProjectAlpha(db) {
  if (!fs.existsSync(PROJECT_ALPHA_SQL_PATH)) {
    return
  }

  db.get(
    "SELECT COUNT(1) AS count FROM builds WHERE name LIKE 'project_alpha_user_%_build_%'",
    (countErr, countRow) => {
      if (countErr) {
        console.error('Failed to inspect builds table:', countErr.message)
        return
      }

      // Seed only once to avoid duplicate rows on every server restart.
      if ((countRow?.count || 0) > 0) {
        return
      }

      const sqlDump = fs.readFileSync(PROJECT_ALPHA_SQL_PATH, 'utf8')
      const insertMatch = sqlDump.match(/INSERT INTO `build`[\s\S]*?VALUES\s*([\s\S]*?);/i)
      if (!insertMatch) {
        return
      }

      const valuesSection = insertMatch[1]
      const rows = [...valuesSection.matchAll(/\((\d+),\s*(\d+),\s*([\d.]+),\s*(\d+),\s*(\d+)\)/g)]
      if (rows.length === 0) {
        return
      }

      const insert = db.prepare(
        'INSERT INTO builds (name, components, total_price, total_watt) VALUES (?, ?, ?, ?)'
      )

      rows.forEach((match) => {
        const buildId = Number(match[1])
        const userId = Number(match[2])
        const totalPrice = Number(match[3])
        const wattage = Number(match[5])
        insert.run(`project_alpha_user_${userId}_build_${buildId}`, '[]', totalPrice, wattage)
      })

      insert.finalize((finalizeErr) => {
        if (finalizeErr) {
          console.error('Failed to seed data from project_alpha.sql:', finalizeErr.message)
        } else {
          console.log(`Seeded ${rows.length} builds from project_alpha.sql`)
        }
      })
    }
  )
}

function parseJsonColumn(value, fallback = []) {
  if (value == null) return fallback

  try {
    return JSON.parse(value)
  } catch {
    return fallback
  }
}

function ensureDb() {
  const dbDir = path.dirname(DB_PATH)
  if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true })

  const db = new sqlite3.Database(DB_PATH)
  db.run('PRAGMA foreign_keys = ON')
  const schema = fs.readFileSync(SCHEMA_PATH, 'utf8')
  db.serialize(() => {
    db.exec(schema, (err) => {
      if (err) {
        console.error('DB schema init failed:', err.message)
      } else {
        console.log('DB ready at', DB_PATH)
        seedDemoInventory(db).catch((seedErr) => {
          console.error('Demo inventory seed failed:', seedErr.message)
        })
        seedBuildsFromProjectAlpha(db)
      }
    })
  })
  db.on('error', (err) => {
    console.error('DB runtime error:', err.message)
  })
  return db
}

module.exports = {
  ensureDb,
  hashPassword,
  verifyPassword,
  normalizeEmail,
  parseJsonColumn,
}
