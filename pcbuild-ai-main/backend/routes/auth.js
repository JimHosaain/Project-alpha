const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const router = express.Router();

module.exports = (db) => {

    // SIGNUP
    router.post("/signup", async (req, res) => {

        const { user_name, email, password, preferences } = req.body;

        try {

            const hashedPassword = await bcrypt.hash(password, 10);

            const sql = `
                INSERT INTO users 
                (user_name, email, password_hash, preferences)
                VALUES (?, ?, ?, ?)
            `;

            db.query(sql, [user_name, email, hashedPassword, preferences], (err, result) => {
              if (err) return res.status(500).json({ error: err.message });
              res.json({ message: 'User Registered Successfully', insertedId: result.insertId });
            });

        } catch (error) {
            res.status(500).json(error);
        }

    });

    // LOGIN
    router.post("/login", (req, res) => {

        const { email, password } = req.body;

        const sql = "SELECT * FROM users WHERE email = ?";

        db.query(sql, [email], async (err, result) => {

            if (err) {
                return res.status(500).json(err);
            }

            if (result.length === 0) {
                return res.status(401).json({
                    message: "User Not Found"
                });
            }

            const user = result[0];
            const validPassword = await bcrypt.compare(password, user.password_hash);

            if (!validPassword) {
                return res.status(401).json({
                    message: "Wrong Password"
                });
            }

            const token = jwt.sign({ id: user.id || user.user_id, email: user.email }, process.env.JWT_SECRET || 'devsecret', { expiresIn: '7d' });

            res.json({
                message: "Login Successful",
                token: token,
                user: user
            });

        });

    });

    return router;

};