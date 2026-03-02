require('dotenv').config();
const mongoose = require('mongoose');

async function testConnection() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB.");

        const db = mongoose.connection.db;
        const shops = await db.collection('shops').find({}).toArray();
        console.log("Shops count:", shops.length);
        console.log("First shop:", shops[0]);

        const boutiques = await db.collection('boutiques').find({}).toArray();
        console.log("Boutiques count:", boutiques.length);
        console.log("First boutique:", boutiques[0]);

        const categories = await db.collection('categories').find({}).toArray();
        console.log("Categories count:", categories.length);
        console.log("First category:", categories[0]);

    } catch (err) {
        console.error(err);
    } finally {
        mongoose.connection.close();
    }
}

testConnection();
