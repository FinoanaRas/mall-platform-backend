const Product = require('../models/Product');

exports.create = async(req,res) => {
    try {
        const product = new Product(req.body);
        await product.save();
        res.status(201).json(product);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getAll = async(req,res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getById = async(req,res) => {
    try {
        const product = await Product.findById(req.params.id);
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Filtre produit
// params: filter, limit, category, order(-1 if descending, 1 if ascending)
exports.getByFilter = async(req,res) => {
    try {
        const allowedFilter = ['price', 'rating'];
        let products;
        const { category, sortFilter, sortOrder, limit, skip } = req.query;
        const order = sortOrder === 'DESC' ? -1 : 1;
        let query = {};
        if(category){
            query.category = category;
        }
        console.log(query);
        if(sortFilter && allowedFilter.includes(sortFilter)){
            products = await Product.find(query).sort({ [sortFilter]: order }).limit(limit).skip(skip);
        }else{
            console.log('filter');
            products = await Product.find(query).limit(limit).skip(skip);
        }
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.update = async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, { returnDocument: 'after' });
        res.json(product);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.delete = async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.json({ message: "Produit supprimé" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};