const smartStoreRows = [
  { store_name: 'Star Tech', store_location: 'Dhaka', website_url: 'https://www.startech.com.bd' },
  { store_name: 'Ryans', store_location: 'Dhaka', website_url: 'https://www.ryans.com' },
  { store_name: 'TechLand', store_location: 'Dhaka', website_url: 'https://www.techlandbd.com' },
  { store_name: 'PCB Store', store_location: 'Chattogram', website_url: 'https://pcbuilderbd.example.com' },
]

function toJson(value) {
  return JSON.stringify(value)
}

const cpuSeed = [
  { brand: 'Intel', model: 'Core i5-12400F', socket: 'LGA1700', cores: 6, threads: 12, benchmark_score: 74, price: 17500, wattage: 65, generation: '12th Gen', stock_status: 'in_stock' },
  { brand: 'Intel', model: 'Core i5-13400F', socket: 'LGA1700', cores: 10, threads: 16, benchmark_score: 82, price: 21900, wattage: 65, generation: '13th Gen', stock_status: 'in_stock' },
  { brand: 'AMD', model: 'Ryzen 5 5600', socket: 'AM4', cores: 6, threads: 12, benchmark_score: 71, price: 16200, wattage: 65, generation: 'Zen 3', stock_status: 'in_stock' },
  { brand: 'AMD', model: 'Ryzen 5 7600', socket: 'AM5', cores: 6, threads: 12, benchmark_score: 87, price: 25500, wattage: 65, generation: 'Zen 4', stock_status: 'in_stock' },
  { brand: 'Intel', model: 'Core i3-14100F', socket: 'LGA1700', cores: 4, threads: 8, benchmark_score: 56, price: 11800, wattage: 58, generation: '14th Gen', stock_status: 'in_stock' },
]

const gpuSeed = [
  { brand: 'NVIDIA', model: 'RTX 3050 6GB', vram_gb: 6, gpu_length_mm: 230, benchmark_score: 52, price: 24500, wattage: 70, stock_status: 'in_stock' },
  { brand: 'NVIDIA', model: 'RTX 4060 8GB', vram_gb: 8, gpu_length_mm: 225, benchmark_score: 71, price: 39800, wattage: 115, stock_status: 'in_stock' },
  { brand: 'NVIDIA', model: 'RTX 4070 12GB', vram_gb: 12, gpu_length_mm: 267, benchmark_score: 88, price: 69500, wattage: 200, stock_status: 'in_stock' },
  { brand: 'AMD', model: 'RX 6600 8GB', vram_gb: 8, gpu_length_mm: 240, benchmark_score: 60, price: 28500, wattage: 132, stock_status: 'in_stock' },
  { brand: 'Intel', model: 'Arc A750 8GB', vram_gb: 8, gpu_length_mm: 267, benchmark_score: 57, price: 26500, wattage: 225, stock_status: 'in_stock' },
]

const motherboardSeed = [
  { brand: 'ASUS', model: 'TUF B550-PLUS', socket: 'AM4', chipset: 'B550', ram_type: 'DDR4', form_factor: 'ATX', benchmark_score: 62, price: 18500, wattage: 35, stock_status: 'in_stock' },
  { brand: 'MSI', model: 'B550M PRO-VDH', socket: 'AM4', chipset: 'B550', ram_type: 'DDR4', form_factor: 'mATX', benchmark_score: 58, price: 14800, wattage: 30, stock_status: 'in_stock' },
  { brand: 'Gigabyte', model: 'B650M DS3H', socket: 'AM5', chipset: 'B650', ram_type: 'DDR5', form_factor: 'mATX', benchmark_score: 71, price: 22500, wattage: 38, stock_status: 'in_stock' },
  { brand: 'ASUS', model: 'Prime Z790-P', socket: 'LGA1700', chipset: 'Z790', ram_type: 'DDR5', form_factor: 'ATX', benchmark_score: 76, price: 34800, wattage: 40, stock_status: 'in_stock' },
  { brand: 'ASRock', model: 'B760M-HDV/M.2', socket: 'LGA1700', chipset: 'B760', ram_type: 'DDR4', form_factor: 'mATX', benchmark_score: 54, price: 13800, wattage: 30, stock_status: 'in_stock' },
]

const ramSeed = [
  { brand: 'Corsair', model: 'Vengeance 16GB DDR4 3200', ram_type: 'DDR4', capacity_gb: 16, speed_mhz: 3200, benchmark_score: 42, price: 5800, wattage: 5, stock_status: 'in_stock' },
  { brand: 'Corsair', model: 'Vengeance 32GB DDR4 3200', ram_type: 'DDR4', capacity_gb: 32, speed_mhz: 3200, benchmark_score: 52, price: 9800, wattage: 6, stock_status: 'in_stock' },
  { brand: 'G.Skill', model: 'Ripjaws S5 32GB DDR5 5600', ram_type: 'DDR5', capacity_gb: 32, speed_mhz: 5600, benchmark_score: 66, price: 11700, wattage: 6, stock_status: 'in_stock' },
  { brand: 'TeamGroup', model: 'T-Force Delta 32GB DDR5 6400', ram_type: 'DDR5', capacity_gb: 32, speed_mhz: 6400, benchmark_score: 75, price: 14100, wattage: 6, stock_status: 'in_stock' },
  { brand: 'Adata', model: 'XPG Lancer 16GB DDR5 5600', ram_type: 'DDR5', capacity_gb: 16, speed_mhz: 5600, benchmark_score: 58, price: 6900, wattage: 5, stock_status: 'in_stock' },
]

const storageSeed = [
  { brand: 'Samsung', model: '970 EVO Plus 500GB', storage_type: 'SSD', interface: 'NVMe', capacity_gb: 500, benchmark_score: 55, price: 5200, wattage: 4, stock_status: 'in_stock' },
  { brand: 'Samsung', model: '990 PRO 1TB', storage_type: 'SSD', interface: 'NVMe', capacity_gb: 1000, benchmark_score: 88, price: 13200, wattage: 5, stock_status: 'in_stock' },
  { brand: 'Seagate', model: 'Barracuda 2TB', storage_type: 'HDD', interface: 'SATA', capacity_gb: 2000, benchmark_score: 28, price: 7600, wattage: 8, stock_status: 'in_stock' },
]

const psuSeed = [
  { brand: 'Corsair', model: 'RM650e', wattage: 650, efficiency_rating: '80+ Gold', benchmark_score: 70, price: 10800, stock_status: 'in_stock' },
  { brand: 'Corsair', model: 'RM750e', wattage: 750, efficiency_rating: '80+ Gold', benchmark_score: 78, price: 13800, stock_status: 'in_stock' },
  { brand: 'Seasonic', model: 'Focus GX-850', wattage: 850, efficiency_rating: '80+ Gold', benchmark_score: 84, price: 17200, stock_status: 'limited' },
]

const caseSeed = [
  { brand: 'Lian Li', model: 'Lancool 216', supported_gpu_length_mm: 392, motherboard_support: 'ATX,mATX,Mini-ITX', benchmark_score: 83, price: 13500, stock_status: 'in_stock' },
  { brand: 'NZXT', model: 'H5 Flow', supported_gpu_length_mm: 365, motherboard_support: 'ATX,mATX,Mini-ITX', benchmark_score: 78, price: 14900, stock_status: 'in_stock' },
  { brand: 'Montech', model: 'X3 Mesh', supported_gpu_length_mm: 305, motherboard_support: 'ATX,mATX,Mini-ITX', benchmark_score: 72, price: 6900, stock_status: 'in_stock' },
]

const coolerSeed = [
  { brand: 'DeepCool', model: 'AK400', socket_support: 'AM4,AM5,LGA1700', cooler_type: 'Air', benchmark_score: 66, price: 3400, wattage: 5, stock_status: 'in_stock' },
  { brand: 'DeepCool', model: 'AG400', socket_support: 'AM4,AM5,LGA1700', cooler_type: 'Air', benchmark_score: 63, price: 2900, wattage: 4, stock_status: 'in_stock' },
  { brand: 'Cooler Master', model: 'Hyper 212 Black', socket_support: 'AM4,AM5,LGA1700', cooler_type: 'Air', benchmark_score: 61, price: 4200, wattage: 5, stock_status: 'in_stock' },
  { brand: 'Thermalright', model: 'Peerless Assassin 120', socket_support: 'AM4,AM5,LGA1700', cooler_type: 'Air', benchmark_score: 79, price: 5200, wattage: 7, stock_status: 'in_stock' },
  { brand: 'NZXT', model: 'Kraken 240', socket_support: 'AM4,AM5,LGA1700', cooler_type: 'AIO', benchmark_score: 82, price: 14900, wattage: 10, stock_status: 'limited' },
  { brand: 'DeepCool', model: 'LS520', socket_support: 'AM4,AM5,LGA1700', cooler_type: 'AIO', benchmark_score: 84, price: 12800, wattage: 10, stock_status: 'limited' },
  { brand: 'Corsair', model: 'H100i Elite', socket_support: 'AM4,AM5,LGA1700', cooler_type: 'AIO', benchmark_score: 86, price: 18900, wattage: 12, stock_status: 'limited' },
  { brand: 'ID-Cooling', model: 'SE-224-XTS', socket_support: 'AM4,AM5,LGA1700', cooler_type: 'Air', benchmark_score: 58, price: 2600, wattage: 4, stock_status: 'in_stock' },
  { brand: 'Arctic', model: 'Liquid Freezer II 240', socket_support: 'AM4,AM5,LGA1700', cooler_type: 'AIO', benchmark_score: 88, price: 15800, wattage: 10, stock_status: 'limited' },
  { brand: 'Antec', model: 'A400 RGB', socket_support: 'AM4,AM5,LGA1700', cooler_type: 'Air', benchmark_score: 55, price: 2300, wattage: 4, stock_status: 'in_stock' },
]

const forumSeed = [
  { user_id: 1, title: 'Need help choosing AM5 motherboard', content: 'Building a Ryzen 7 system under 120k BDT. Which board is best for upgrade path?', category: 'Motherboard', tags_json: toJson(['AM5', 'budget', 'bangladesh']) },
  { user_id: 2, title: 'Best GPU for 1440p gaming', content: 'Is RTX 4070 Super worth it over RX 7800 XT for local pricing?', category: 'GPU', tags_json: toJson(['GPU', 'gaming']) },
  { user_id: 3, title: 'PSU watt for RTX 4070 Super', content: 'Can I safely pair a 750W Gold PSU with a 7600X?', category: 'PSU', tags_json: toJson(['PSU', 'watt']) },
]

const newsSeed = [
  { title: 'Bangladesh PC market sees lower DDR5 prices', summary: 'Retailers in Dhaka report better availability of 32GB DDR5 kits this month.', source_name: 'PCB News', source_url: 'https://example.com/news/ddr5-prices', published_at: '2026-05-10' },
  { title: 'Local shops list more RTX 4070 Super stock', summary: 'Star Tech and Ryans show improved inventory for mid-range gaming builds.', source_name: 'PCB News', source_url: 'https://example.com/news/rtx4070-super', published_at: '2026-05-12' },
  { title: 'AM5 motherboards now easier to find', summary: 'Budget B650 boards are becoming more common in Bangladesh stores.', source_name: 'PCB News', source_url: 'https://example.com/news/am5-boards', published_at: '2026-05-15' },
]

function insertMany(db, table, columns, rows) {
  const placeholders = `(${columns.map(() => '?').join(', ')})`
  const sql = `INSERT INTO ${table} (${columns.join(', ')}) VALUES ${placeholders}`
  return rows.reduce((promise, row) => promise.then(() => new Promise((resolve, reject) => {
    const values = columns.map((column) => row[column])
    db.query(sql, values, (err) => (err ? reject(err) : resolve()))
  })), Promise.resolve())
}

function bootstrapSmartCatalog(db) {
  const statements = [
    `CREATE TABLE IF NOT EXISTS cpu_catalog (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      brand TEXT NOT NULL,
      model TEXT NOT NULL,
      socket TEXT NOT NULL,
      cores INTEGER NOT NULL,
      threads INTEGER NOT NULL,
      benchmark_score INTEGER NOT NULL DEFAULT 0,
      price NUMERIC NOT NULL DEFAULT 0,
      wattage INTEGER NOT NULL DEFAULT 0,
      generation TEXT,
      stock_status TEXT DEFAULT 'in_stock',
      compatibility_json TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS gpu_catalog (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      brand TEXT NOT NULL,
      model TEXT NOT NULL,
      vram_gb INTEGER NOT NULL,
      gpu_length_mm INTEGER NOT NULL,
      benchmark_score INTEGER NOT NULL DEFAULT 0,
      price NUMERIC NOT NULL DEFAULT 0,
      wattage INTEGER NOT NULL DEFAULT 0,
      stock_status TEXT DEFAULT 'in_stock',
      compatibility_json TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS motherboard_catalog (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      brand TEXT NOT NULL,
      model TEXT NOT NULL,
      socket TEXT NOT NULL,
      chipset TEXT NOT NULL,
      ram_type TEXT NOT NULL,
      form_factor TEXT NOT NULL,
      benchmark_score INTEGER NOT NULL DEFAULT 0,
      price NUMERIC NOT NULL DEFAULT 0,
      wattage INTEGER NOT NULL DEFAULT 0,
      stock_status TEXT DEFAULT 'in_stock',
      compatibility_json TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS ram_catalog (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      brand TEXT NOT NULL,
      model TEXT NOT NULL,
      ram_type TEXT NOT NULL,
      capacity_gb INTEGER NOT NULL,
      speed_mhz INTEGER NOT NULL,
      benchmark_score INTEGER NOT NULL DEFAULT 0,
      price NUMERIC NOT NULL DEFAULT 0,
      wattage INTEGER NOT NULL DEFAULT 0,
      stock_status TEXT DEFAULT 'in_stock',
      compatibility_json TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS storage_catalog (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      brand TEXT NOT NULL,
      model TEXT NOT NULL,
      storage_type TEXT NOT NULL,
      interface TEXT NOT NULL,
      capacity_gb INTEGER NOT NULL,
      benchmark_score INTEGER NOT NULL DEFAULT 0,
      price NUMERIC NOT NULL DEFAULT 0,
      wattage INTEGER NOT NULL DEFAULT 0,
      stock_status TEXT DEFAULT 'in_stock',
      compatibility_json TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS psu_catalog (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      brand TEXT NOT NULL,
      model TEXT NOT NULL,
      wattage INTEGER NOT NULL DEFAULT 0,
      efficiency_rating TEXT NOT NULL,
      benchmark_score INTEGER NOT NULL DEFAULT 0,
      price NUMERIC NOT NULL DEFAULT 0,
      stock_status TEXT DEFAULT 'in_stock',
      compatibility_json TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS case_catalog (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      brand TEXT NOT NULL,
      model TEXT NOT NULL,
      supported_gpu_length_mm INTEGER NOT NULL,
      motherboard_support TEXT NOT NULL,
      benchmark_score INTEGER NOT NULL DEFAULT 0,
      price NUMERIC NOT NULL DEFAULT 0,
      stock_status TEXT DEFAULT 'in_stock',
      compatibility_json TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS cooler_catalog (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      brand TEXT NOT NULL,
      model TEXT NOT NULL,
      socket_support TEXT NOT NULL,
      cooler_type TEXT NOT NULL,
      benchmark_score INTEGER NOT NULL DEFAULT 0,
      price NUMERIC NOT NULL DEFAULT 0,
      wattage INTEGER NOT NULL DEFAULT 0,
      stock_status TEXT DEFAULT 'in_stock',
      compatibility_json TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS smart_stores (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      store_name TEXT NOT NULL,
      store_location TEXT,
      website_url TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS smart_store_availability (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      store_id INTEGER NOT NULL,
      component_type TEXT NOT NULL,
      component_id INTEGER NOT NULL,
      price NUMERIC NOT NULL DEFAULT 0,
      stock_status TEXT DEFAULT 'in_stock',
      source_url TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(store_id) REFERENCES smart_stores(id) ON DELETE CASCADE
    )`,
    `CREATE TABLE IF NOT EXISTS smart_recommendations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      budget NUMERIC NOT NULL DEFAULT 0,
      use_case TEXT NOT NULL,
      preferred_brand TEXT,
      storage_preference TEXT,
      request_json TEXT,
      result_json TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS forums (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      category TEXT,
      tags_json TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS news (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      summary TEXT,
      source_name TEXT,
      source_url TEXT,
      published_at DATE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,
    `DROP VIEW IF EXISTS smart_component_catalog`,
    `CREATE VIEW smart_component_catalog AS
      SELECT 'cpu' AS component_type, id, brand, model, benchmark_score, price, wattage, stock_status, socket AS compatibility_a, NULL AS compatibility_b, NULL AS compatibility_c, created_at FROM cpu_catalog
      UNION ALL SELECT 'gpu' AS component_type, id, brand, model, benchmark_score, price, wattage, stock_status, CAST(vram_gb AS TEXT), CAST(gpu_length_mm AS TEXT), NULL AS compatibility_c, created_at FROM gpu_catalog
      UNION ALL SELECT 'motherboard' AS component_type, id, brand, model, benchmark_score, price, wattage, stock_status, socket, ram_type, form_factor, created_at FROM motherboard_catalog
      UNION ALL SELECT 'ram' AS component_type, id, brand, model, benchmark_score, price, wattage, stock_status, ram_type, CAST(capacity_gb AS TEXT), CAST(speed_mhz AS TEXT), created_at FROM ram_catalog
      UNION ALL SELECT 'storage' AS component_type, id, brand, model, benchmark_score, price, wattage, stock_status, storage_type, interface, CAST(capacity_gb AS TEXT), created_at FROM storage_catalog
      UNION ALL SELECT 'psu' AS component_type, id, brand, model, benchmark_score, price, wattage, stock_status, efficiency_rating, CAST(wattage AS TEXT), NULL AS compatibility_c, created_at FROM psu_catalog
        UNION ALL SELECT 'case' AS component_type, id, brand, model, benchmark_score, price, 0 AS wattage, stock_status, CAST(supported_gpu_length_mm AS TEXT), motherboard_support, NULL AS compatibility_c, created_at FROM case_catalog
      UNION ALL SELECT 'cooler' AS component_type, id, brand, model, benchmark_score, price, wattage, stock_status, socket_support, cooler_type, NULL AS compatibility_c, created_at FROM cooler_catalog`
  ]

  const exec = (sql) => new Promise((resolve, reject) => {
    db.query(sql, (err) => (err ? reject(err) : resolve()))
  })

  const countRows = (table) => new Promise((resolve, reject) => {
    db.query(`SELECT COUNT(1) AS count FROM ${table}`, (err, rows) => {
      if (err) return reject(err)
      resolve(rows?.[0]?.count || 0)
    })
  })

  const bootstrap = statements.reduce((promise, sql) => promise.then(() => exec(sql)), Promise.resolve())

  return bootstrap.then(async () => {
    if (await countRows('smart_stores') === 0) {
      await insertMany(db, 'smart_stores', ['store_name', 'store_location', 'website_url'], smartStoreRows)
    }
    if (await countRows('cpu_catalog') === 0) {
      await insertMany(db, 'cpu_catalog', ['brand', 'model', 'socket', 'cores', 'threads', 'benchmark_score', 'price', 'wattage', 'generation', 'stock_status', 'compatibility_json'], cpuSeed.map((row) => ({ ...row, compatibility_json: toJson({ socket: row.socket, generation: row.generation }) })))
    }
    if (await countRows('gpu_catalog') === 0) {
      await insertMany(db, 'gpu_catalog', ['brand', 'model', 'vram_gb', 'gpu_length_mm', 'benchmark_score', 'price', 'wattage', 'stock_status', 'compatibility_json'], gpuSeed.map((row) => ({ ...row, compatibility_json: toJson({ gpu_length_mm: row.gpu_length_mm, vram_gb: row.vram_gb }) })))
    }
    if (await countRows('motherboard_catalog') === 0) {
      await insertMany(db, 'motherboard_catalog', ['brand', 'model', 'socket', 'chipset', 'ram_type', 'form_factor', 'benchmark_score', 'price', 'wattage', 'stock_status', 'compatibility_json'], motherboardSeed.map((row) => ({ ...row, compatibility_json: toJson({ socket: row.socket, ram_type: row.ram_type, form_factor: row.form_factor }) })))
    }
    if (await countRows('ram_catalog') === 0) {
      await insertMany(db, 'ram_catalog', ['brand', 'model', 'ram_type', 'capacity_gb', 'speed_mhz', 'benchmark_score', 'price', 'wattage', 'stock_status', 'compatibility_json'], ramSeed.map((row) => ({ ...row, compatibility_json: toJson({ ram_type: row.ram_type, capacity_gb: row.capacity_gb }) })))
    }
    if (await countRows('storage_catalog') === 0) {
      await insertMany(db, 'storage_catalog', ['brand', 'model', 'storage_type', 'interface', 'capacity_gb', 'benchmark_score', 'price', 'wattage', 'stock_status', 'compatibility_json'], storageSeed.map((row) => ({ ...row, compatibility_json: toJson({ storage_type: row.storage_type, interface: row.interface }) })))
    }
    if (await countRows('psu_catalog') === 0) {
      await insertMany(db, 'psu_catalog', ['brand', 'model', 'wattage', 'efficiency_rating', 'benchmark_score', 'price', 'stock_status', 'compatibility_json'], psuSeed.map((row) => ({ ...row, compatibility_json: toJson({ wattage: row.wattage, efficiency_rating: row.efficiency_rating }) })))
    }
    if (await countRows('case_catalog') === 0) {
      await insertMany(db, 'case_catalog', ['brand', 'model', 'supported_gpu_length_mm', 'motherboard_support', 'benchmark_score', 'price', 'stock_status', 'compatibility_json'], caseSeed.map((row) => ({ ...row, compatibility_json: toJson({ supported_gpu_length_mm: row.supported_gpu_length_mm, motherboard_support: row.motherboard_support }) })))
    }
    if (await countRows('cooler_catalog') === 0) {
      await insertMany(db, 'cooler_catalog', ['brand', 'model', 'socket_support', 'cooler_type', 'benchmark_score', 'price', 'wattage', 'stock_status', 'compatibility_json'], coolerSeed.map((row) => ({ ...row, compatibility_json: toJson({ socket_support: row.socket_support, cooler_type: row.cooler_type }) })))
    }
    if (await countRows('forums') === 0) {
      await insertMany(db, 'forums', ['user_id', 'title', 'content', 'category', 'tags_json'], forumSeed)
    }
    if (await countRows('news') === 0) {
      await insertMany(db, 'news', ['title', 'summary', 'source_name', 'source_url', 'published_at'], newsSeed)
    }
  })
}

function smartCatalogRoutes(db) {
  const express = require('express')
  const router = express.Router()

  router.get('/catalog', (req, res) => {
    db.query('SELECT * FROM smart_component_catalog ORDER BY component_type, price ASC', (err, rows) => {
      if (err) return res.status(500).json({ error: err.message })
      res.json(rows)
    })
  })

  router.get('/catalog/:type', (req, res) => {
    const type = String(req.params.type || '').toLowerCase()
    const tableMap = {
      cpu: 'cpu_catalog',
      gpu: 'gpu_catalog',
      motherboard: 'motherboard_catalog',
      ram: 'ram_catalog',
      storage: 'storage_catalog',
      psu: 'psu_catalog',
      case: 'case_catalog',
      cooler: 'cooler_catalog',
    }
    const table = tableMap[type]
    if (!table) return res.status(400).json({ error: 'Unsupported catalog type' })
    db.query(`SELECT * FROM ${table} ORDER BY price ASC`, (err, rows) => {
      if (err) return res.status(500).json({ error: err.message })
      res.json(rows)
    })
  })

  router.get('/stores', (req, res) => {
    db.query('SELECT * FROM smart_stores ORDER BY store_name ASC', (err, rows) => {
      if (err) return res.status(500).json({ error: err.message })
      res.json(rows)
    })
  })

  router.get('/availability', (req, res) => {
    const sql = `SELECT a.id, a.store_id, s.store_name, s.store_location, s.website_url, a.component_type, a.component_id, a.price, a.stock_status, a.source_url
                 FROM smart_store_availability a
                 LEFT JOIN smart_stores s ON s.id = a.store_id
                 ORDER BY s.store_name ASC, a.component_type ASC, a.price ASC`
    db.query(sql, (err, rows) => {
      if (err) return res.status(500).json({ error: err.message })
      res.json(rows)
    })
  })

  router.get('/recommendations', (req, res) => {
    db.query('SELECT * FROM smart_recommendations ORDER BY created_at DESC', (err, rows) => {
      if (err) return res.status(500).json({ error: err.message })
      res.json(rows)
    })
  })

  router.get('/forums', (req, res) => {
    db.query('SELECT * FROM forums ORDER BY created_at DESC', (err, rows) => {
      if (err) return res.status(500).json({ error: err.message })
      res.json(rows)
    })
  })

  router.get('/news', (req, res) => {
    db.query('SELECT * FROM news ORDER BY published_at DESC, created_at DESC', (err, rows) => {
      if (err) return res.status(500).json({ error: err.message })
      res.json(rows)
    })
  })

  return router
}

module.exports = {
  bootstrapSmartCatalog,
  smartCatalogRoutes,
}
