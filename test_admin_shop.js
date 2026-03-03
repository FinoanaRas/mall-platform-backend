const axios = require('axios');
const mongoose = require('mongoose');
const User = require('/Users/rinasonya/Desktop/Franck/Professionnel/Master1-ITU/mall-platform/backend/mall-platform-backend/models/User.js');
const dbConfig = require('dotenv').config({ path: '/Users/rinasonya/Desktop/Franck/Professionnel/Master1-ITU/mall-platform/backend/mall-platform-backend/.env' });
const jwt = require('jsonwebtoken');
const FormData = require('form-data');

async function test() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const admin = await User.findOne({ profile: 'ADMIN' });
        if (!admin) throw new Error("No admin found");

        const token = jwt.sign({ id: admin._id, profile: admin.profile }, process.env.JWT_SECRET, { expiresIn: '1h' });

        const fd = new FormData();
        fd.append('name', 'Script Test Shop');
        fd.append('idOwner', admin._id.toString());
        fd.append('description', 'Test Description');
        fd.append('status', '1');

        // Find a category
        const Category = require('/Users/rinasonya/Desktop/Franck/Professionnel/Master1-ITU/mall-platform/backend/mall-platform-backend/models/Category.js');
        let cat = await Category.findOne();
        if (!cat) {
            cat = new Category({ name: 'Script Category' });
            await cat.save();
        }
        fd.append('idCategory', cat._id.toString());

        console.log("Sending req...");
        const res = await axios.post('http://localhost:5001/admin/shops', fd, {
            headers: {
                ...fd.getHeaders(),
                'Authorization': `Bearer ${token}`
            }
        });
        console.log("Success:", res.data);
    } catch (e) {
        console.log("Error status:", e.response?.status);
        console.log("Error data:", e.response?.data);
        console.log("Error msg:", e.message);
    } finally {
        mongoose.connection.close();
    }
}
test();
