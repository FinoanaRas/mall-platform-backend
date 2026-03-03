const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    startDate: { type: Date },
    endDate: { type: Date },
    location: { type: String },
    status: { type: String }
}, { collection: "events", timestamps: true });

module.exports = mongoose.model('Event', EventSchema);