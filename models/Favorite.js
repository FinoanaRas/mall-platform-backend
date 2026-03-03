const mongoose = require('mongoose');

const FavoriteSchema = new mongoose.Schema({
    idShop: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop' },
    idUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { collection: "favorite", timestamps: true });

FavoriteSchema.index({idShop: 1, idUser: 1}, { unique: true });

module.exports = mongoose.model('Favorite', FavoriteSchema);
