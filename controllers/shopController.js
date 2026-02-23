const Shop = require('../models/Shop');
// Créer un shop
exports.create = async (req, res) => {
    try {
        const shop = new Shop(req.body);
        await shop.save();
        res.status(201).json(shop);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Lire tous les shops
exports.getAll = async (req, res) => {
    try {
        const shops = await Shop.find();
        res.json(shops);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Mettre à jour un shop
exports.update = async (req, res) => {
    try {
        const shop = await Shop.findByIdAndUpdate(req.params.id, req.body, {new: true});
        res.json(shop);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Supprimer un shop
exports.delete =async (req, res) => {
    try {
        await Shop.findByIdAndDelete(req.params.id);
        res.json({ message: "Shop supprimé" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};