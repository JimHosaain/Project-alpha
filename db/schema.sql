-- Schema for PC-Builder builds
CREATE TABLE IF NOT EXISTS builds (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT DEFAULT 'manual',
  components TEXT NOT NULL,
  total_price INTEGER NOT NULL,
  total_watt INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS users (
  user_id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  preferences TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  last_login DATETIME
);

CREATE TABLE IF NOT EXISTS pc_parts (
  part_id INTEGER PRIMARY KEY AUTOINCREMENT,
  category TEXT NOT NULL,
  part_name TEXT NOT NULL,
  brand TEXT,
  model TEXT,
  price INTEGER NOT NULL,
  watt INTEGER DEFAULT 0,
  stock_status TEXT DEFAULT 'In Stock',
  specs_json TEXT NOT NULL DEFAULT '{}',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS stores (
  store_id INTEGER PRIMARY KEY AUTOINCREMENT,
  store_name TEXT NOT NULL UNIQUE,
  store_location TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS store_availability (
  availability_id INTEGER PRIMARY KEY AUTOINCREMENT,
  store_id INTEGER NOT NULL,
  part_id INTEGER NOT NULL,
  stock_status TEXT DEFAULT 'In Stock',
  price INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (store_id) REFERENCES stores(store_id) ON DELETE CASCADE,
  FOREIGN KEY (part_id) REFERENCES pc_parts(part_id) ON DELETE CASCADE,
  UNIQUE(store_id, part_id)
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_pc_parts_category ON pc_parts(category);
CREATE INDEX IF NOT EXISTS idx_store_availability_part ON store_availability(part_id);
