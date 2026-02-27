const mongoose = require('mongoose');
require('dotenv').config();
const { User } = require('./models/User');

const fixAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected');
        const res = await User.deleteMany({ email: 'admin@mall.com' });
        console.log(`Deleted ${res.deletedCount} admins`);
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

fixAdmin();
