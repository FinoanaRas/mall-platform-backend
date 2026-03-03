const mongoose = require('./node_modules/mongoose');
const { User } = require('./models/User.js');
const dbConfig = require('dotenv').config({ path: './.env' });
const jwt = require('./node_modules/jsonwebtoken');

async function test() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const admin = await User.findOne({ profile: 'ADMIN' });
        if (!admin) throw new Error("No admin found");

        const token = jwt.sign({ id: admin._id, profile: admin.profile }, process.env.SECRET_KEY, { expiresIn: '1h' });

        const fd = new FormData();
        fd.append('name', 'Script Test Shop');
        fd.append('idOwner', admin._id.toString());
        fd.append('description', 'Test Description');
        fd.append('status', '1');

        const Category = require('./models/Category.js');
        let cat = await Category.findOne();
        if (!cat) {
            cat = new Category({ name: 'Script Category' });
            await cat.save();
        }
        fd.append('idCategory', cat._id.toString());

        console.log("Sending req...");
        const res = await fetch('http://localhost:5001/admin/shops', {
            method: 'POST',
            body: fd,
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const text = await res.text();
        console.log("Status:", res.status);
        console.log("Response:", text);
    } catch (e) {
        console.log("Exception:", e);
    } finally {
        mongoose.connection.close();
    }
}
test();
