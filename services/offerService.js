const Shop = require('../models/Shop');
const Product = require('../models/Product');
const Offer = require('../models/Offer');
const OfferService = {
    async getOffers(idUser, status){
        const shop = await Shop.findOne({ idOwner: idUser });
        if (!shop) return [];
        return await this.getOffersShop(shop._id, status);
    },
    async getOffersShop(idShop, status) {
        const products = await Product.find({ idShop: idShop }).select('_id');
        const now = new Date();
        console.log(products);
        console.log(idShop);
        console.log(status);
        return await Offer.find({
            idTarget: { $in: [idShop, ...products] },
            status: status,
            endDate : { $gte: now }
        });
    },
    async getHistoricOffers (idUser, status) {
        const shop = await Shop.findOne({ idOwner: idUser });
        if (!shop) return [];
        return await this.getHistoricOffersShop(shop._id, status);
    },
    async getHistoricOffersShop (idShop, status) {
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