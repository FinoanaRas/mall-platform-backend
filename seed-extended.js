const mongoose = require('mongoose');
require('dotenv').config();

const Shop = require('./models/Shop');
const Category = require('./models/Category');
const Product = require('./models/Product');
const { User } = require('./models/User');

const seedExtendedData = async () => {
    if (!process.env.MONGO_URI) {
        console.error('MONGO_URI is missing from .env file');
        process.exit(1);
    }

    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected for Extended Seeding');

        // 1. Get Categories
        const highTechCategory = await Category.findOne({ name: 'High-Tech' });
        const fastFoodCategory = await Category.findOne({ name: 'Fast Food' });
        let admin = await User.findOne({ role: 'ADMIN' });

        if (!highTechCategory || !fastFoodCategory || !admin) {
            console.error('Missing required Categories or Admin user. Please ensure base seeding is done.');
            process.exit(1);
        }

        // 2. Create Shops
        console.log('Creating extended shops...');
        const shops = await Shop.create([
            {
                name: "iStore Premium",
                description: "Revendeur officiel des produits Apple. Découvrez les derniers iPhone, Mac, et accessoires officiels.",
                idCategory: highTechCategory._id,
                owner: admin._id,
                location: "Zone A, Étage 1",
                picture: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&q=80&w=2000",
                rating: 4.8,
                status: 1
            },
            {
                name: "Galaxy Tech",
                description: "L'univers Samsung et Android. Smartphones, tablettes, montres connectées et objets intelligents.",
                idCategory: highTechCategory._id,
                owner: admin._id,
                location: "Zone B, RDC",
                picture: "https://images.unsplash.com/photo-1531297172867-4f5111ce876e?auto=format&fit=crop&q=80&w=2000",
                rating: 4.6,
                status: 1
            },
            {
                name: "Pizza Napoli",
                description: "Les meilleures pizzas napolitaines cuites au feu de bois. Pâte fraîche et ingrédients d'Italie.",
                idCategory: fastFoodCategory._id,
                owner: admin._id,
                location: "Food Court, Étage 2",
                picture: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&q=80&w=2000",
                rating: 4.7,
                status: 1
            }
        ]);

        const iStore = shops[0];
        const galaxyTech = shops[1];
        const pizzaNapoli = shops[2];
        console.log('Shops created.');

        // 3. Create Products for iStore
        console.log('Creating High-Tech products...');
        await Product.create([
            {
                name: "iPhone 15 Pro Max",
                description: "Puce A17 Pro, design en titane, et système photo le plus puissant jamais vu sur iPhone.",
                price: 1479.00,
                stock: 15,
                rating: 4.9,
                picture: "https://images.unsplash.com/photo-1696446701796-da61225697cc?auto=format&fit=crop&q=80&w=1000",
                idShop: iStore._id,
                idCategory: highTechCategory._id
            },
            {
                name: "MacBook Pro M3",
                description: "L'ordinateur portable pro ultime. Des performances inouïes pour les workflows les plus exigeants.",
                price: 1999.00,
                stock: 8,
                rating: 4.8,
                picture: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=1000",
                idShop: iStore._id,
                idCategory: highTechCategory._id
            },
            {
                name: "AirPods Pro 2",
                description: "Réduction active du bruit avancée et Audio spatial personnalisé.",
                price: 279.00,
                stock: 30,
                rating: 4.7,
                picture: "https://images.unsplash.com/photo-1606220945770-b5b6cf270a6c?auto=format&fit=crop&q=80&w=1000",
                idShop: iStore._id,
                idCategory: highTechCategory._id
            }
        ]);

        // 4. Create Products for Galaxy Tech
        await Product.create([
            {
                name: "Samsung Galaxy S24 Ultra",
                description: "L'ère de l'IA mobile est là. Titanium, affichage ultra-lumineux et zoom x100.",
                price: 1469.00,
                stock: 20,
                rating: 4.8,
                picture: "https://images.unsplash.com/photo-1707055740445-562db4bd9807?auto=format&fit=crop&q=80&w=1000",
                idShop: galaxyTech._id,
                idCategory: highTechCategory._id
            },
            {
                name: "Galaxy Watch 6",
                description: "Suivi du sommeil avancé, composition corporelle et écran plus grand.",
                price: 319.00,
                stock: 15,
                rating: 4.5,
                picture: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&q=80&w=1000",
                idShop: galaxyTech._id,
                idCategory: highTechCategory._id
            }
        ]);

        // 5. Create Products for Pizza Napoli
        console.log('Creating Fast Food products...');
        await Product.create([
            {
                name: "Pizza Margherita authentique",
                description: "Sauce tomate San Marzano, mozzarella di bufala, basilic frais.",
                price: 12.50,
                stock: 100,
                rating: 4.7,
                picture: "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?auto=format&fit=crop&q=80&w=1000",
                idShop: pizzaNapoli._id,
                idCategory: fastFoodCategory._id
            },
            {
                name: "Pizza Diavola",
                description: "Sauce tomate, mozzarella, spianata piccante, piments forts.",
                price: 14.00,
                stock: 50,
                rating: 4.8,
                picture: "https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&q=80&w=1000",
                idShop: pizzaNapoli._id,
                idCategory: fastFoodCategory._id
            },
            {
                name: "Tiramisu Maison",
                description: "Mascarpone crémeux, biscuits cuillère au café, cacao amer.",
                price: 7.00,
                stock: 30,
                rating: 4.9,
                picture: "https://images.unsplash.com/photo-1571115177098-24ec2b68078c?auto=format&fit=crop&q=80&w=1000",
                idShop: pizzaNapoli._id,
                idCategory: fastFoodCategory._id
            }
        ]);

        console.log('Successfully seeded extended shops and products!');
        process.exit(0);
    } catch (error) {
        console.error('Error during extended seeding:', error);
        process.exit(1);
    }
};

seedExtendedData();
