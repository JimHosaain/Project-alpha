-- SQLite migrations for pcbuild-ai-main backend
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  preferences TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS components (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  category TEXT NOT NULL,
  brand TEXT,
  model TEXT,
  price NUMERIC DEFAULT 0.00,
  watt INTEGER,
  stock_status TEXT DEFAULT 'in_stock',
  specs_json TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS builds (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  total_price NUMERIC DEFAULT 0.00,
  fps INTEGER,
  wattage INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS build_components (
  build_id INTEGER NOT NULL,
  component_id INTEGER NOT NULL,
  PRIMARY KEY (build_id, component_id),
  FOREIGN KEY(build_id) REFERENCES builds(id) ON DELETE CASCADE,
  FOREIGN KEY(component_id) REFERENCES components(id) ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS stores (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  store_name TEXT NOT NULL,
  store_location TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS store_availability (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  store_id INTEGER NOT NULL,
  component_id INTEGER NOT NULL,
  price NUMERIC DEFAULT 0.00,
  stock_status TEXT DEFAULT 'in_stock',
  FOREIGN KEY(store_id) REFERENCES stores(id) ON DELETE CASCADE,
  FOREIGN KEY(component_id) REFERENCES components(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS comments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  post_id INTEGER,
  content TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS budgets (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  amount NUMERIC DEFAULT 0.00,
  FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Example view
CREATE VIEW IF NOT EXISTS build_summary AS
SELECT b.id AS build_id, b.user_id, b.total_price, b.fps, b.wattage, COUNT(bc.component_id) AS component_count
FROM builds b
LEFT JOIN build_components bc ON b.id = bc.build_id
GROUP BY b.id;
