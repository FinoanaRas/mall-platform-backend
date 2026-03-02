const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: {
        type: String,
        enum: ['INFO', 'SUCCESS', 'WARNING', 'ERROR'],
        default: 'INFO'
    },
    icon: { type: String, default: 'notifications' },
    color: { type: String, default: '#64748b' },
    read: { type: Boolean, default: false },
    targetUrl: { type: String }, // Optional link to take user to relevant page
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } // Null for global admin notifications
}, { timestamps: true });

module.exports = mongoose.model('Notification', NotificationSchema);
