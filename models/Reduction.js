const mongoose = require('mongoose');

const ReductionSchema = new mongoose.Schema({
    idProduct: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    percentage: { type: Number, required: true, min: 0 },
    startDate: { type: Date },
    endDate: { type: Date },
    status: { 
        type: String,
        enum: ['PENDING', 'ACCEPTED']  
    }
}, { collection: "reductions", timestamps: true });

module.exports = mongoose.model('Reduction', ReductionSchema);