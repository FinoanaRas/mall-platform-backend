const Favorite = require('../models/Favorite');

exports.create = async (req,res) => {
    try {
        const shop = req.body.idShop;
        const favorite = new Favorite({ idShop: shop, idUser: req.user.id });
        await favorite.save();
        res.status(201).json(favorite);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getAllByUser = async(req,res) => {
    try {
        const shops = await Favorite.find({ idUser: req.user.id }).populate('idShop');
        res.json(shops);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.delete = async (req,res) => {
    try{
        await Favorite.findByIdAndDelete(req.params.id);
        res.json({ message: "Boutique enlevée des favoris" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};