const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// Creer un article
router.post('/', async (req, res) => {
    try {
        const article = new Product(req.body);
        await article.save();
        res.status(201).json(article);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Lire tous les articles
router.get('/', async (_req, res) => {
    try {
        const articles = await Product.find();
        res.json(articles);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Mettre a jour un article
router.put('/:id', async (req, res) => {
    try {
        const article = await Product.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        res.json(article);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Supprimer un article
router.delete('/:id', async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.json({ message: 'Article supprime' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
