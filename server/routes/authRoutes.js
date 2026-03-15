const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../config/db');
const { generateToken } = require('../middleware/auth');

router.post('/login', async (req, res) => {
    try {
        const { phone, password } = req.body;
        
        if (!phone || !password) {
            return res.status(400).json({ 
                message: 'Phone and password are required' 
            });
        }

        const [users] = await db.query(
            'SELECT * FROM users WHERE phone = ?',
            [phone]
        );

        if (users.length === 0) {
            return res.status(401).json({ 
                message: 'Invalid phone or password' 
            });
        }

        const user = users[0];
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ 
                message: 'Invalid phone or password' 
            });
        }
        const token = generateToken(user.id, user.role);
        res.json({
            user_id: user.id,
            full_name: user.full_name,
            phone: user.phone,
            role: user.role,
            token
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ 
            message: 'Server error during login' 
        });
    }
});

router.post('/register', async (req, res) => {
    try {
        const { full_name, phone, password, role } = req.body;

        // Input validation
        if (!full_name || !phone || !password) {
            return res.status(400).json({ 
                message: 'Full name, phone, and password are required' 
            });
        }

        if (phone.length > 15) {
            return res.status(400).json({ 
                message: 'Phone number must be max 15 characters' 
            });
        }

        // Check if user already exists
        const [existingUsers] = await db.query(
            'SELECT id FROM users WHERE phone = ?',
            [phone]
        );

        if (existingUsers.length > 0) {
            return res.status(409).json({ 
                message: 'Phone number already registered' 
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        const userRole = role || 'customer';
        const [result] = await db.query(
            'INSERT INTO users (full_name, phone, password, role) VALUES (?, ?, ?, ?)',
            [full_name, phone, hashedPassword, userRole]
        );

        const userId = result.insertId;
        const token = generateToken(userId, userRole);

        res.status(201).json({
            user_id: userId,
            full_name,
            phone,
            role: userRole,
            token
        });

    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ 
            message: 'Server error during registration' 
        });
    }
});

module.exports = router;
