const Review = require('../models/Review');
const mongoose = require('mongoose');
const ReviewService = {
    updateRating : async (idTarget, targetType) => {
        const stats = await Review.aggregate([
            { 
                $match: { idTarget: idTarget } 
            },
            {
                $group: {
                    _id: '$idTarget',
                    nRating: { $sum: 1 },
                    avgRating: { $avg: '$rating' }
                }
            }
        ]);
        console.log(stats);

        // Use targetType to dynamically select the Collection ('Product' or 'Shop')
        const Model = mongoose.model(targetType);

        if (stats.length > 0) {
            console.log(Model);
            await Model.findByIdAndUpdate(idTarget, {
                rating: Math.round(stats[0].avgRating * 10) / 10
            });
        } else {
            await Model.findByIdAndUpdate(idTarget, {
                rating: 0
            });
        }
    }
};

module.exports = ReviewService;