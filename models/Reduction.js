const mongoose = require('mongoose');

const ReductionSchema = new mongoose.Schema({
    idProduct: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    percentage: { type: Number, required: true },
    startDate: { type: Date },
    endDate: { type: Date },
    status: { type: String }
}, { collection: "reductions", timestamps: true });

module.exports = mongoose.model('Reduction', ReductionSchema);