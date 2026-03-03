const Offer = require('../models/Offer');
const TargetModelService = require('../services/targetModelService');
// Créer un offer
exports.create = async (req, res) => {
    try {
        const { idTarget, targetType } = req.body;
        const check = await TargetModelService.validateTarget(idTarget, targetType);
        if (!check.isValid) {
            return res.status(400).json({ message: check.message });
        }

        const offer = new Offer({
            ...req.body,
            status: req.user.role === 'ADMIN' ? 'VALIDATED' : 'PENDING'
        });

        await offer.save();
        res.status(201).json(offer);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Obtenir ses propres offres (pour un Shop)
exports.getMyOffers = async (req, res) => {
    try {
        // First find the shop owned by the user
        const Shop = require('../models/Shop');
        const shop = await Shop.findOne({ idOwner: req.user.id });
        if (!shop) return res.status(404).json({ message: "Boutique non trouvée" });

        const offers = await Offer.find({ idTarget: shop._id, targetType: 'Shop' });
        // Also might want to include product offers if the product belongs to the shop
        // For simplicity, let's start with Shop offers
        res.json(offers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Lire tous les offers (Filtre optionnel par status pour Admin)
exports.getAll = async (req, res) => {
    try {
        const { status } = req.query;
        let query = {};
        if (status) query.status = status;

        const offers = await Offer.find(query).populate('idTarget');
        res.json(offers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Mettre à jour un offer
exports.update = async (req, res) => {
    try {
        const offer = await Offer.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(offer);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Supprimer un offer
exports.delete = async (req, res) => {
    try {
        await Offer.findByIdAndDelete(req.params.id);
        res.json({ message: "Offer supprimé" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};