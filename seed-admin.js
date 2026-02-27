const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const { User } = require('./models/User');

const seedAdmin = async () => {
    if (!process.env.MONGO_URI) {
        console.error('MONGO_URI is missing');
        process.exit(1);
    }

    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected');

        const existingAdmin = await User.findOne({ email: 'admin@mall.com' });
        if (existingAdmin) {
            console.log('Admin already exists!');
            process.exit(0);
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('admin123', salt);

        const adminUser = new User({
            name: 'Super Admin',
            email: 'admin@mall.com',
            password: hashedPassword,
            profile: 'ADMIN',
            status: 1
        });

        await adminUser.save();
        console.log('Admin created successfully! Email: admin@mall.com | Pass: admin123');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedAdmin();
