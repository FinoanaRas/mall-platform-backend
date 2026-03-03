const mongoose = require('mongoose');

// Review for either a product or a shop
const ReviewSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    idTarget: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'targetType'
    },
    targetType: {
        type: String,
        required: true,
        enum: ['Product', 'Shop']
    },
    comment: { type: String },
    rating: { type: Number, required: true, min: 1, max: 5 }
}, { collection: "reviews", timestamps: true });

// one review per person
ReviewSchema.index({ idTarget: 1, user: 1}, { unique: true });

module.exports = mongoose.model('Review', ReviewSchema);