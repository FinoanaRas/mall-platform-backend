const mongoose = require('mongoose');
require('dotenv').config();
const Shop = require('./models/Shop');
const Product = require('./models/Product');
const { User } = require('./models/User');
const Review = require('./models/Review');
const bcrypt = require('bcryptjs');

const shopId = '69a1d8391826b9f87feeb37f';

async function seed() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const salt = await bcrypt.genSalt(10);
        const password = await bcrypt.hash('password123', salt);

        // Create 2 more customers
        const user1 = new User({ name: 'Alice Test', email: 'alice@test.com', password, profile: 'CUSTOMER', status: 1 });
        const user2 = new User({ name: 'Bob Test', email: 'bob@test.com', password, profile: 'CUSTOMER', status: 1 });

        await user1.save();
        await user2.save();
        console.log('2 Customers created');

        const products = [
            { name: 'Pizza BBQ', price: 18, description: 'Tasty pizza', idShop: shopId },
            { name: 'Salade César', price: 10, description: 'Fresh salad', idShop: shopId },
            { name: 'Tiramisu', price: 8, description: 'Sweet dessert', idShop: shopId }
        ];
        await Product.insertMany(products);
        console.log('3 Products seeded');

        const reviews = [
            { idTarget: shopId, targetType: 'Shop', user: user1._id, rating: 5, comment: 'Sensationnel !' },
            { idTarget: shopId, targetType: 'Shop', user: user2._id, rating: 4, comment: 'Très bonne adresse.' }
        ];
        await Review.insertMany(reviews);
        console.log('2 Reviews seeded');

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

seed();
