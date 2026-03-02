const Shop = require('../models/Shop');
const Product = require('../models/Product');
const Offer = require('../models/Offer');
const OfferService = {
    getOffers : async (idUser, status) => {
        const shop = await Shop.findOne({ idOwner: idUser });
        if (!shop) return [];
        return await this.getPendingOffersShop(shop._id, status);
    },
    getOffersShop : async (idShop, status) => {
        const products = await Product.find({ idShop: idShop }).select('_id');
        const now = new Date();
        return await Offer.find({
            idTarget: { $in: [idShop, ...products] },
            status: status,
            endDate : { $gte: now }
        });
    },
    getHistoricOffers : async (idUser, status) => {
        const shop = await Shop.findOne({ idOwner: idUser });
        if (!shop) return [];
        return await this.getHistoricOffersShop(shop._id, status);
    },
    getHistoricOffersShop : async (idShop, status) => {
        const now = new Date();
        const products = await Product.find({ idShop: idShop }).select('_id');
        return await Offer.find({
            idTarget: { $in: [idShop, ...products] },
            status: status,
            endDate : { $lt: now }
        });
    }
};



module.exports = OfferService;