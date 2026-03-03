const Product = require('../models/Product');
const Shop = require('../models/Shop');

// Create Product
exports.create = async (req, res) => {
    try {
        const shop = await Shop.findOne({ idOwner: req.user.id });
        if (!shop) return res.status(404).json({ message: "Boutique non trouvée." });

        const productData = {
            ...req.body,
            idShop: shop._id
        };

        if (req.file) {
            productData.picture = req.file.path; // Cloudinary URL
        }

        const product = new Product(productData);
        await product.save();
        res.status(201).json(product);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get My Products (for Shop)
exports.getMyProducts = async (req, res) => {
    try {
        const shop = await Shop.findOne({ idOwner: req.user.id });
        if (!shop) return res.status(404).json({ message: "Boutique non trouvée." });

        const products = await Product.find({ idShop: shop._id });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update Product
exports.update = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: "Produit non trouvé." });

        const shop = await Shop.findOne({ idOwner: req.user.id });
        if (!product.idShop.equals(shop._id)) {
            return res.status(403).json({ message: "Action non autorisée." });
        }

        const productData = { ...req.body };
        if (req.file) {
            productData.picture = req.file.path;
        }

        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, productData, { new: true });
        res.json(updatedProduct);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete Product
exports.delete = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: "Produit non trouvé." });

        const shop = await Shop.findOne({ idOwner: req.user.id });
        if (!product.idShop.equals(shop._id)) {
            return res.status(403).json({ message: "Action non autorisée." });
        }

        await Product.findByIdAndDelete(req.params.id);
        res.json({ message: "Produit supprimé." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
