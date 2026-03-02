const mongoose = require('mongoose');
require('dotenv').config();

const uri = process.env.MONGO_URI;

async function run() {
    try {
        console.log("Tentative de connexion à MongoDB avec l'URI :", uri);
        await mongoose.connect(uri, { dbName: 'test' });
        console.log("Connecté à MongoDB Atlas Cloud avec succès !");

        // test fetch from 'users' collection
        const db = mongoose.connection.db;
        const usersCollection = db.collection('users');

        const users = await usersCollection.find({}).limit(5).toArray();
        console.log(`Fetch de la collection 'users' réussi. Nombre de documents trouvés (max 5) : ${users.length}`);
        console.log(JSON.stringify(users, null, 2));

    } catch (err) {
        console.error("Erreur de connexion ou de fetch :", err);
    } finally {
        await mongoose.disconnect();
        console.log("Déconnecté de MongoDB.");
    }
}

run();
