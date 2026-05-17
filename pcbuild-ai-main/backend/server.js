const express = require("express");
// use sqlite adapter instead of mysql when running locally
const mysql = require("mysql2");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// require local sqlite adapter
const { db: sqliteDb, query, beginTransaction, commit, rollback } = require('./db');
const db = { query, beginTransaction, commit, rollback };
console.log('Using local SQLite adapter for backend');

const authRoutes = require("./routes/auth")(db);

app.use("/auth", authRoutes);

// run migrations on startup (reads migrations.sql and executes statements)
const fs = require('fs');
try {
        const migrationsPath = fs.existsSync(__dirname + '/migrations.sqlite.sql') ? '/migrations.sqlite.sql' : '/migrations.sql';
        const migrations = fs.readFileSync(__dirname + migrationsPath, 'utf8');
        // execute statements sequentially
        const stmts = migrations.split(/;\s*\n/).map(s => s.trim()).filter(Boolean);
        sqliteDb.serialize(() => {
            sqliteDb.run('PRAGMA foreign_keys = ON');
            stmts.forEach(stmt => {
                try {
                    sqliteDb.run(stmt, (err) => {
                        if (err) console.warn('Migration statement warning:', err.message);
                    });
                } catch (e) {
                    console.warn('Migration execution error:', e.message);
                }
            });
            console.log('SQLite migrations applied (if any)');
        });
} catch (e) {
        console.warn('No migrations file found or failed to read:', e.message);
}

// demo SQL operations router
const demoQueries = require('./routes/demoQueries')(db);
app.use('/demo', demoQueries);

// mount admin API under /api
const apiAdmin = require('./routes/apiAdmin')(db);
app.use('/api', apiAdmin);

const { bootstrapSmartCatalog, smartCatalogRoutes } = require('./smartCatalog');
const smartBuilderRoutes = require('./routes/smartBuilder');
bootstrapSmartCatalog(db).then(() => {
    console.log('Smart catalog schema and seed data ready');
}).catch((err) => {
    console.warn('Smart catalog bootstrap warning:', err.message);
});
app.use('/smart', smartCatalogRoutes(db));
app.use('/smart/builder', smartBuilderRoutes(db));

app.get("/", (req, res) => {

    res.send("Backend Running Successfully");

});

app.get("/users", (req, res) => {
    db.query("SELECT * FROM users", (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(result);
    });
});

app.get("/components", (req, res) => {
    const sql = "SELECT * FROM components";
    db.query(sql, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(result);
    });
});

app.listen(5000, () => {

    console.log("Server Running On Port 5000");

});