const Offer = require('../models/Offer');
const TargetModelService = require('../services/targetModelService');
// Créer un offer
exports.create = async (req, res) => {
    try {
        const offer = new Offer(req.body);
        const { idTarget, targetType } = req.body;
        const check = await TargetModelService.validateTarget(idTarget, targetType);
        if (!check.isValid) {
            // STOP execution and send error
            return res.status(400).json({ message: check.message });
        }
        await offer.save();
        res.status(201).json(offer);
 
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Lire tous les offers
exports.getAll = async (req, res) => {
    try {
        const offers = await Offer.find().populate('idTarget');
        res.json(offers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Mettre à jour un offer
exports.update = async (req, res) => {
    try {
        const offer = await Offer.findByIdAndUpdate(req.params.id, req.body, {new: true});
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