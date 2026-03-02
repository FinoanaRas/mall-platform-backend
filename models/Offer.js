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
        enum: ['Shop','Product']
    },
    idEvent: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: false },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    status: { 
        type: String,
        required: true,
        enum: ['PENDING', 'VALIDATED'] 
    }
}, { collection: "offers", timestamp: true });

module.exports = mongoose.model('Offer', OfferSchema);