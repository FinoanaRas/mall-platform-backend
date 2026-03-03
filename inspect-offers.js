const mongoose = require('mongoose');
const Offer = require('./models/Offer');
require('dotenv').config();

const inspectOffers = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const offers = await Offer.find();
        console.log('All Offers:', JSON.stringify(offers, null, 2));

        const countNeValidated = await Offer.countDocuments({ status: { $ne: 'VALIDATED' } });
        console.log('Count (status != VALIDATED):', countNeValidated);

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

inspectOffers();
