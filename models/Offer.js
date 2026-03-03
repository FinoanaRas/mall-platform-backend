const mongoose = require('mongoose');

const OfferSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    idTarget: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'targetType'
    },
    targetType: {
        type: String,
        required: true,
        enum: ['Shop', 'Product']
    },
    idEvent: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: false },
    startDate: { type: Date },
    endDate: { type: Date },
    status: { type: String }
}, { collection: "offers", timestamps: true });

module.exports = mongoose.model('Offer', OfferSchema);