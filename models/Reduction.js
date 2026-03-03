const mongoose = require('mongoose');

// Optionally attached to an offer or not
const ReductionSchema = new mongoose.Schema({
    idProduct: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    idOffer: { type: mongoose.Schema.Types.ObjectId, ref: 'Offer' },
    percentage: { type: Number, required: true , min: 0, max: 100},
    startDate: { type: Date },
    endDate: { type: Date },
    status: { type: String }
}, { collection: "reductions", timestamps: true });

module.exports = mongoose.model('Reduction', ReductionSchema);