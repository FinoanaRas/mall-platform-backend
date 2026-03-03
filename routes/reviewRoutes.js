const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const Shop = require('../models/Shop');
const Product = require('../models/Product');
const authMiddleware = require('../middlewares/authMiddleware');

// Créer un avis
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { idTarget, targetType, comment, rating } = req.body;
        const review = new Review({
            user: req.user.id,
            idTarget,
            targetType,
            comment,
            rating
        });
        await review.save();

        // Update target average rating (Simple implementation)
        const TargetModel = targetType === 'Shop' ? Shop : Product;
        const reviews = await Review.find({ idTarget, targetType });
        const avgRating = reviews.reduce((acc, rev) => acc + rev.rating, 0) / reviews.length;

        await TargetModel.findByIdAndUpdate(idTarget, { rating: avgRating });

        res.status(201).json(review);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Lire les avis d'une cible
router.get('/:targetType/:idTarget', async (req, res) => {
    try {
        const { targetType, idTarget } = req.params;
        const reviews = await Review.find({ idTarget, targetType }).populate('user', 'name');
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Répondre à un avis (Shop only)
router.post('/:id/reply', authMiddleware, async (req, res) => {
    try {
        const { comment } = req.body;
        const review = await Review.findById(req.params.id);
        if (!review) return res.status(404).json({ message: "Avis non trouvé" });

        // Basic security: check if user owns the target (if it's a shop)
        if (review.targetType === 'Shop') {
            const shop = await Shop.findById(review.idTarget);
            if (!shop || shop.idOwner.toString() !== req.user.id) {
                return res.status(403).json({ message: "Vous n'êtes pas autorisé à répondre à cet avis." });
            }
        }

        review.reply = {
            comment,
            date: new Date()
        };
        await review.save();
        res.json(review);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
