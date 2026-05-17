const fs = require('fs');
const path = require('path');
const { db } = require('./db');

function parseValuesTuple(tuple) {
  // tuple like (1, 'text', NULL, 'O\'Brien')
  const s = tuple.trim().replace(/^\(|\)$/g, '');
  const vals = [];
  let cur = '';
  let inQuote = false;
  let quoteChar = null;
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (inQuote) {
      if (ch === quoteChar) {
        // check escaped quote
        const prev = s[i-1];
        if (prev === '\\') {
          cur = cur.slice(0, -1) + ch; // unescape
        } else {
          inQuote = false;
          quoteChar = null;
        }
      } else {
        cur += ch;
      }
    } else {
      if (ch === '\'' || ch === '"') {
        inQuote = true;
        quoteChar = ch;
      } else if (ch === ',') {
        vals.push(cur === 'NULL' ? null : cur);
        cur = '';
      } else {
        cur += ch;
      }
    }
  }
  if (cur.length > 0) vals.push(cur === 'NULL' ? null : cur);
  return vals.map(v => {
    if (v === null) return null;
    // trim surrounding whitespace
    const t = String(v).trim();
    return t;
  });
}

function importTable(sqlText, tableName, columnMap, targetCols) {
  const insertRegex = new RegExp("INSERT INTO `" + tableName + "`\\s*\\(([^)]+)\\)\\s*VALUES\\s*(.+?);","gis");
  let m;
  let total = 0;
  while ((m = insertRegex.exec(sqlText)) !== null) {
    const colsRaw = m[1];
    const valsRaw = m[2];
    const cols = colsRaw.split(',').map(c => c.replace(/`/g,'').trim());
    // find all tuples
    const tuples = Array.from(valsRaw.matchAll(/\([^\)]*\)/g)).map(x => x[0]);
    tuples.forEach(t => {
      const vals = parseValuesTuple(t);
      // build param object
      const row = {};
      cols.forEach((c,i) => {
        const mapped = columnMap[c] || c;
        row[mapped] = vals[i] !== undefined ? vals[i] : null;
      });
      // create param array following targetCols order
      const params = targetCols.map(c => row[c] !== undefined ? row[c] : null);
      const placeholders = targetCols.map(_ => '?').join(',');
      const sql = `INSERT OR IGNORE INTO ${tableName === 'user' ? 'users' : (tableName==='component'?'components':(tableName==='build'?'builds':(tableName==='buildcomponent'?'build_components':(tableName==='store'?'stores':(tableName==='storeavailability'?'store_availability':tableName)))))} (${targetCols.join(',')}) VALUES (${placeholders})`;
      db.serialize(() => {
        db.run(sql, params, function(err) {
          if (err) console.warn('Insert warning for', tableName, err.message);
        });
      });
      total++;
    });
  }
  return total;
}

async function run() {
  const dumpPath = path.join(__dirname, '..', 'database', 'project_alpha.sql');
  if (!fs.existsSync(dumpPath)) {
    console.error('project_alpha.sql not found at', dumpPath);
    process.exit(1);
  }
  const sql = fs.readFileSync(dumpPath, 'utf8');

  // Target tables and mappings
  const tables = [
    {
      name: 'user',
      columnMap: { user_id: 'id', user_name: 'user_name', email: 'email', user_password: 'password_hash', preferences: 'preferences' },
      targetCols: ['id','user_name','email','password_hash','preferences']
    },
    {
      name: 'component',
      columnMap: { component_id: 'id', component_name: 'model', type: 'category' },
      targetCols: ['id','category','brand','model','price','watt','stock_status','specs_json']
    },
    {
      name: 'build',
      columnMap: { build_id: 'id', user_id: 'user_id', total_price: 'total_price', fps: 'fps', watt: 'watt' },
      targetCols: ['id','user_id','total_price','fps','watt']
    },
    {
      name: 'buildcomponent',
      columnMap: { build_id: 'build_id', component_id: 'component_id' },
      targetCols: ['build_id','component_id']
    },
    {
      name: 'store',
      columnMap: { store_id: 'id', store_name: 'store_name', store_location: 'store_location', created_at: 'created_at' },
      targetCols: ['id','store_name','store_location','created_at']
    },
    {
      name: 'storeavailability',
      columnMap: { availability_id: 'id', store_id: 'store_id', component_id: 'component_id', stock_status: 'stock_status', price: 'price' },
      targetCols: ['id','store_id','component_id','stock_status','price']
    }
  ];

  db.serialize(() => {
    db.run('BEGIN TRANSACTION');
    let totalInserted = 0;
    tables.forEach(t => {
      try {
        const count = importTable(sql, t.name, t.columnMap, t.targetCols);
        totalInserted += count;
      } catch (e) {
        console.warn('Failed to import table', t.name, e.message);
      }
    });
    db.run('COMMIT');
    console.log('Import complete. attempted rows:', totalInserted);
  });
}

run().catch(err => { console.error(err); process.exit(1); });
