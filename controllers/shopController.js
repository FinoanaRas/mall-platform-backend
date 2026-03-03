const Shop = require('../models/Shop');
const Category = require('../models/Category');
const Product = require('../models/Product');
const Review = require('../models/Review');

// Créer un shop
exports.create = async (req, res) => {
    try {
        const shop = new Shop(req.body);
        await shop.save();
        res.status(201).json(shop);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Lire tous les shops
exports.getAll = async (req, res) => {
    try {
        const { category, q } = req.query;
        let query = {};
        if (category) query.idCategory = category;
        if (q) query.name = { $regex: q, $options: 'i' };

        const shops = await Shop.find(query).populate('idCategory');
        res.json(shops);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Lire un shop par ID avec ses produits et avis
exports.getById = async (req, res) => {
    try {
        const shop = await Shop.findById(req.params.id).populate('idCategory');
        if (!shop) return res.status(404).json({ message: "Shop non trouvé" });

        const products = await Product.find({ idShop: shop._id });
        // Let's check if Product has a shop link. Viewing Product model again.

        const reviews = await Review.find({ idTarget: shop._id, targetType: 'Shop' }).populate('user', 'name');

        res.json({ shop, products, reviews });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getCategories = async (req, res) => {
    try {
        const categories = await Category.find().sort({ name: 1 });
        res.json(categories);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Mettre à jour un shop
exports.update = async (req, res) => {
    try {
        const shop = await Shop.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(shop);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Supprimer un shop
exports.delete = async (req, res) => {
    try {
        await Shop.findByIdAndDelete(req.params.id);
        res.json({ message: "Shop supprimé" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obtenir le shop de l'utilisateur connecté
exports.getMyShop = async (req, res) => {
    try {
        console.log('[DEBUG] getMyShop for user:', req.user);
        const shop = await Shop.findOne({ idOwner: req.user.id }).populate('idCategory');
        if (!shop) {
            console.log('[DEBUG] No shop found for owner:', req.user.id);
            return res.status(404).json({ message: "Vous n'avez pas encore de boutique." });
        }
        res.json(shop);
    } catch (err) {
        console.error('[DEBUG] getMyShop ERROR:', err);
        res.status(500).json({ message: err.message });
    }
};

exports.getStats = async (req, res) => {
    try {
        const shop = await Shop.findOne({ idOwner: req.user.id });
        if (!shop) return res.status(404).json({ message: "Shop non trouvé" });

        // Use aggregation for a "view-like" coherent data fetch
        const stats = await Shop.aggregate([
            { $match: { _id: shop._id } },
            {
                $lookup: {
                    from: 'products',
                    localField: '_id',
                    foreignField: 'idShop',
                    as: 'allProducts'
                }
            },
            {
                $lookup: {
                    from: 'offers',
                    localField: '_id',
                    foreignField: 'idTarget',
                    as: 'allOffers'
                }
            },
            {
                $lookup: {
                    from: 'reviews',
                    localField: '_id',
                    foreignField: 'idTarget',
                    as: 'allReviews'
                }
            },
            {
                $project: {
                    productCount: { $size: '$allProducts' },
                    offerCount: {
                        $size: {
                            $filter: {
                                input: '$allOffers',
                                as: 'offer',
                                cond: { $eq: ['$$offer.targetType', 'Shop'] }
                            }
                        }
                    },
                    reviewCount: {
                        $size: {
                            $filter: {
                                input: '$allReviews',
                                as: 'rev',
                                cond: { $eq: ['$$rev.targetType', 'Shop'] }
                            }
                        }
                    },
                    rating: { $ifNull: ['$rating', 0] }
                }
            }
        ]);

        const recentReviews = await Review.find({ idTarget: shop._id, targetType: 'Shop' })
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('user', 'name');

        res.json({
            stats: stats[0] || { productCount: 0, offerCount: 0, reviewCount: 0, rating: 0 },
            reviews: recentReviews
        });
    } catch (err) {
        console.error('[STATS ERROR]:', err);
        res.status(500).json({ message: err.message });
    }
};

// Mettre à jour le profil de son propre shop
exports.updateProfile = async (req, res) => {
    try {
        const shop = await Shop.findOneAndUpdate(
            { idOwner: req.user.id },
            req.body,
            { new: true }
        );
        if (!shop) return res.status(404).json({ message: "Boutique non trouvée." });
        res.json(shop);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};