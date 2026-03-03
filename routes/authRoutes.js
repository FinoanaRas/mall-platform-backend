const express = require('express');
const authService = require('../services/authService');
const { User } = require('../models/User');
var bcrypt = require('bcryptjs');
const router = express.Router();

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const token = await authService.authenticate(email, password);
        res.json({ token });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/customer/sign-up', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = new User({
            name,
            email,
            "password": hashedPassword,
            "profile": "CUSTOMER",
            "status": 0,
            "creation_date": new Date()
        });
        await user.save();
        const token = await authService.authenticate(email, password);
        res.json({ token });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


module.exports = router;