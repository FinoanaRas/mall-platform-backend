const Reduction = require('../models/Reduction');

exports.create = async (req,res) => {
    try {
        const reduction = new Reduction(req.body);
        await reduction.save();
        res.status(201).json(reduction);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getByProduct = async (req,res) => {
    try {
        const reductions = await Reduction.find({idProduct: req.params.id}).populate();
        res.json(reductions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getByOffer = async (req,res) => {
    try {
        const reductions = await Reduction.find({idOffer: req.params.id}).populate();
        res.json(reductions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.update = async (req, res) => {
    try {
        const reduction = await Reduction.findByIdAndUpdate(req.params.id, req.body, { returnDocument: 'after' });
        res.json(reduction);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.delete = async (req, res) => {
    try {
        await Reduction.findByIdAndDelete(req.params.id);
        res.json({ message: "Reduction supprimé" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};