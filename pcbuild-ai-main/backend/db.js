const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const dbPath = path.join(__dirname, 'app.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Failed to open SQLite DB:', err.message);
  } else {
    console.log('SQLite DB opened at', dbPath);
  }
});

function query(sql, params, cb) {
  if (typeof params === 'function') {
    cb = params;
    params = [];
  }
  // detect SELECT vs others
  const trimmed = sql.trim().toUpperCase();
  if (trimmed.startsWith('SELECT') || trimmed.startsWith('PRAGMA')) {
    db.all(sql, params, (err, rows) => cb && cb(err, rows));
  } else {
    db.run(sql, params, function(err) {
      // mimic mysql result with affectedRows / insertId
      const result = { affectedRows: this.changes || 0, insertId: this.lastID };
      cb && cb(err, result);
    });
  }
}

function beginTransaction(cb) {
  db.run('BEGIN TRANSACTION', cb);
}
function commit(cb) {
  db.run('COMMIT', cb);
}
function rollback(cb) {
  db.run('ROLLBACK', cb);
}

module.exports = {
  db,
  query,
  beginTransaction,
  commit,
  rollback
};
