const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    idShop: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop' },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String },
    idCategory: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    rating: { type: Number, default: 0 }
}, { collection: "products", timestamps: true });

module.exports = mongoose.model('Product', ProductSchema);
