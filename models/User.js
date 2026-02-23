const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
    profile: { type: String, enum: ['ADMIN','SHOP','CUSTOMER'], default: 'CUSTOMER' },
    status: { type: Number, required: true }
}, { collection: "users", timestamps: true });

module.exports = {
    User: mongoose.model('User', UserSchema)
};