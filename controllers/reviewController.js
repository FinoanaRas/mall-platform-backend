const Review = require('../models/Review');
const ReviewService = require('../services/reviewService');

exports.create = async (req,res) => {
    try {
        const review = new Review(req.body);
        await review.save();
        await ReviewService.updateRating(review.idTarget, review.targetType);
        res.status(201).json(review);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.update = async (req, res) => {
    try {
        const review = await Review.findByIdAndUpdate(req.params.id, req.body, { returnDocument: 'after' });
        await ReviewService.updateRating(review.idTarget, review.targetType);
        res.json(review);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getByTarget = async (req,res) => {
    try {
        const reviews = await Review.find({idTarget: req.params.id}).populate('idTarget');
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getByIdUser = async (req,res) => {
    try {
        const reviews = await Review.find({user: req.params.id}).populate('idTarget');
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};