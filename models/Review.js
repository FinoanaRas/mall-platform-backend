const mongoose = require('mongoose');

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
    rating: { type: Number, required: true, min: 1, max: 5 },
    reply: {
        comment: { type: String },
        date: { type: Date }
    }
}, { collection: "reviews", timestamps: true });

module.exports = mongoose.model('Review', ReviewSchema);