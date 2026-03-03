const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI;
const SHOP_ID = '69a1d8391826b9f87feeb37f';

const products = [
    {
        idShop: SHOP_ID,
        name: 'Burger Deluxe Premium',
        description: 'Bœuf wagyu, cheddar affiné, oignons caramélisés et sauce secrète maison.',
        price: 15.50,
        picture: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=1000',
        idCategory: '69a056a1782400ac26942767', // Fast Food (Assuming this is the ID)
        status: 1
    },
    {
        idShop: SHOP_ID,
        name: 'Tacos Al Pastor Special',
        description: 'Trois tacos authentiques au porc mariné, ananas et coriandre fraîche.',
        price: 12.00,
        picture: 'https://images.unsplash.com/photo-1552332386-f8dd00dc2f85?auto=format&fit=crop&q=80&w=1000',
        idCategory: '69a056a1782400ac26942767',
        status: 1
    },
    {
        idShop: SHOP_ID,
        name: 'Crispy Chicken Wings',
        description: '12 ailes de poulet croustillantes avec sauce buffalo piquante ou BBQ.',
        price: 18.00,
        picture: 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?auto=format&fit=crop&q=80&w=1000',
        idCategory: '69a056a1782400ac26942767',
        status: 1
    },
    {
        idShop: SHOP_ID,
        name: 'Frites Maison Truffées',
        description: 'Frites coupées à la main, sel de mer et huile de truffe blanche.',
        price: 7.50,
        picture: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&q=80&w=1000',
        idCategory: '69a056a1782400ac26942767',
        status: 1
    },
    {
        idShop: SHOP_ID,
        name: 'Milkshake Vanille Bourbon',
        description: 'Glace onctueuse à la vanille de Madagascar et crème fouettée.',
        price: 8.00,
        picture: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&q=80&w=1000',
        idCategory: '69a056a1782400ac26942767',
        status: 1
    }
];

async function seed() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB');

        // Delete existing products for this shop to avoid duplicates while testing
        await Product.deleteMany({ idShop: SHOP_ID });
        console.log('Old products deleted');

        await Product.insertMany(products);
        console.log('New products seeded successfully!');

        process.exit(0);
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
}

seed();
