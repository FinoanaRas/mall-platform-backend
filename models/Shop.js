const mongoose = require('mongoose');

const ShopSchema = new mongoose.Schema({
    idOwner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    description: { type: String },
    idCategory: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    location: { type: String },
    picture: { type: String },
    rating: { type: Number, default: 0 }, // Updated manually after new reviews
    status: { type: Number, default: 1 }, // 1: Open, 0: Closed
    openingHours: [{
        day: { type: String, required: true }, // e.g., 'Monday', 'Tuesday'
        open: { type: String }, // e.g., '09:00'
        close: { type: String }, // e.g., '20:00'
        isClosed: { type: Boolean, default: false }
    }],
    closingSchedules: [{
        reason: { type: String },
        startDate: { type: Date },
        endDate: { type: Date }
    }],
    contactInfo: {
        phone: { type: String },
        website: { type: String },
        socialMedia: {
            facebook: { type: String },
            instagram: { type: String }
        }
    }
}, { collection: "shops", timestamps: true });

module.exports = mongoose.model('Shop', ShopSchema);