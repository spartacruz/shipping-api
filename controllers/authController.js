// authController.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
dotenv.config();

// Login function
exports.login = (req, res) => {
    const { email, password } = req.body;
    console.log("Login attempt with email:", email, "and password:", password);

    User.findByEmail(email, (err, user) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ status: "error", message: "Database error" });
        }

        if (!user) {
            console.log("User not found.");
            return res.status(401).json({ status: "error", message: "Invalid email or password" });
        }

        console.log("Stored hashed password:", user.password);

        if (!bcrypt.compareSync(password.trim(), user.password)) {
            console.log("Password mismatch.");
            return res.status(401).json({ status: "error", message: "Invalid email or password" });
        }

        const accessToken = jwt.sign({ id: user.id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
        res.json({ status: "success", user: { name: user.email }, authorization: { token: accessToken, type: "bearer" } });
    });
};

// Registration function
exports.register = (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ status: "error", message: "Email and password are required" });
    }

    // Check if the user already exists
    User.findByEmail(email, (err, user) => {
        if (err) return res.status(500).json({ status: "error", message: "Database error" });
        if (user) return res.status(400).json({ status: "error", message: "User already exists" });

        // Hash the password correctly
        const hashedPassword = bcrypt.hashSync(password, 10);
        console.log("Hashed password before insertion:", hashedPassword);

        // Insert the new user with the hashed password
        User.create(email, hashedPassword, (err, newUser) => {
            if (err) return res.status(500).json({ status: "error", message: "Database error" });
            res.status(201).json({ status: "success", message: "User registered successfully" });
        });
    });
};
