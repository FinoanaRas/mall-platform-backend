const mongoose = require('mongoose');
const { User } = require('./models/User');
const Shop = require('./models/Shop');
const Offer = require('./models/Offer');
const Category = require('./models/Category');
require('dotenv').config();

const seedTestData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected');

        // 1. Create a Category
        let category = await Category.findOne({ name: 'Electronic' });
        if (!category) {
            category = new Category({ name: 'Electronic' });
            await category.save();
        }

        // 2. Create a Shop Owner
        let owner = await User.findOne({ email: 'owner@test.com' });
        if (!owner) {
            owner = new User({
                name: 'Test Owner',
                email: 'owner@test.com',
                password: 'password123',
                profile: 'SHOP',
                status: 1
            });
            await owner.save();
        }

        // 3. Create active Shops
        const shopCount = await Shop.countDocuments();
        if (shopCount < 5) {
            for (let i = 1; i <= 5; i++) {
                const shop = new Shop({
                    idOwner: owner._id,
                    name: `Test Shop ${i}`,
                    description: `Description for shop ${i}`,
                    idCategory: category._id,
                    location: `Level ${i}`
                });
                await shop.save();
            }
            console.log('5 Shops created');
        }

        // 4. Create Pending Offers
        const offerCount = await Offer.countDocuments({ status: 'PENDING' });
        if (offerCount < 3) {
            const firstShop = await Shop.findOne();
            for (let i = 1; i <= 3; i++) {
                const offer = new Offer({
                    title: `Promo ${i}`,
                    description: `Description for promo ${i}`,
                    status: 'PENDING',
                    idTarget: firstShop._id,
                    targetType: 'Shop'
                });
                await offer.save();
            }
            console.log('3 Pending Offers created');
        }

        console.log('Test data seeded successfully!');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedTestData();
