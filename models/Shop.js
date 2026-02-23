const mongoose = require('mongoose');

const ShopSchema = new mongoose.Schema({
    idOwner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    description: { type: String },
    idCategory: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    location: { type: String },
    picture: { type: String },
    rating: { type: Number, default: 0 } // Updated manually after new reviews
}, { collection: "shops", timestamps: true });

module.exports = mongoose.model('Shop', ShopSchema);