const express = require('express');
const router = express.Router();
const { User } = require('../models/User');
const authMiddleware = require('../middlewares/authMiddleware');

// Ajouter un shop aux favoris
router.post('/favorites/:shopId', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user.favorites.includes(req.params.shopId)) {
            user.favorites.push(req.params.shopId);
            await user.save();
        }
        res.json(user.favorites);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Supprimer un shop des favoris
router.delete('/favorites/:shopId', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        user.favorites = user.favorites.filter(id => id.toString() !== req.params.shopId);
        await user.save();
        res.json(user.favorites);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/favorites', authMiddleware, async (req, res) => {
    try {
        console.log(`[FAVORITES] Fetching for user: ${req.user?.id}`);
        const user = await User.findById(req.user.id).populate('favorites');
        if (!user) return res.status(404).json({ message: "User not found" });

        // Filter out nulls (deleted shops)
        const favorites = user.favorites.filter(f => f != null);
        res.json(favorites);
    } catch (error) {
        console.error('[FAVORITES] Error:', error);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
