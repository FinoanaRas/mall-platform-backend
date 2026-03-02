const Offer = require('../models/Offer');
const TargetModelService = require('../services/targetModelService');
const OfferService = require('../services/offerService');
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

// Obtenir tous les offers
exports.getAll = async (req, res) => {
    try {
        const offers = await Offer.find().populate('idTarget');
        res.json(offers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// Obtenir tous les offers pending
exports.getAll = async (req, res) => {
    try {
        const offers = await Offer.find({ status: 'PENDING' }).populate('idTarget');
        res.json(offers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAllActive = async (req, res) => {
    try {
        const now = new Date();
        const offers = await Offer.find({ status: 'VALIDATED', endDate : { $gte: now }}).populate('idTarget');
        res.json(offers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAllPending = async (req, res) => {
    try {
        const now = new Date();
        const offers = await Offer.find({ status: 'PENDING', endDate : { $gte: now }}).populate('idTarget');
        res.json(offers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAllHistoric = async (req, res) => {
    try {
        const now = new Date();
        const offers = await Offer.find({ status: 'VALIDATED', endDate : { $lt: now }}).populate('idTarget');
        res.json(offers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Mettre à jour un offer
exports.update = async (req, res) => {
    try {
        const offer = await Offer.findByIdAndUpdate(req.params.id, req.body, { returnDocument: 'after' });
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

// Offres en attente de validation
exports.findPendingOffers = async (req, res) => {
    try {
        let offers;
        // If shop id (when admin check pending offers of a shop)
        if(req.params.id){
            offers = await OfferService.getOffersShop(req.params.id, 'PENDING');
        // if user id, so inside user in req, the shop user's id
        }else{
            offers = await OfferService.getOffers(req.user.id, 'PENDING');
        }
        res.json(offers);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Offres actifs
exports.findActiveOffers = async (req, res) => {
    try {
        let offers;
        // If shop id (when admin/user check pending offers of a shop)
        if(req.params.id){
            offers = await OfferService.getOffersShop(req.params.id, 'VALIDATED');
        // if user id, so inside user in req, the shop user's id
        }else{
            offers = await OfferService.getOffers(req.user.id, 'VALIDATED');
        }
        res.json(offers);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.findActiveAll = async (req, res) => {
    try{
        const offers = await Offer.find({status: 'VALIDATED'}).populate();
        res.json(offers);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Offres historique
exports.findHistoricOffers = async (req, res) => {
    try {
        let offers;
        // If shop id (when admin check pending offers of a shop)
        if(req.params.id){
            offers = await OfferService.getHistoricOffersShop(req.params.id, 'VALIDATED');
        // if user id, so inside user in req, the shop user's id
        }else{
            offers = await OfferService.getHistoricOffers(req.user.id, 'VALIDATED');
        }
        res.json(offers);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};