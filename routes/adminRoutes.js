const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const adminMiddleware = require('../middlewares/adminMiddleware');
const { upload } = require('../config/cloudinary');

// Apply admin middleware to all routes in this file
router.use(adminMiddleware);

// --- Dashboard ---
router.get('/dashboard/stats', adminController.getDashboardStats);

// --- Global Search ---
router.get('/search', adminController.globalSearch);

// --- Notifications ---
router.get('/notifications', adminController.getNotifications);
router.put('/notifications/mark-all-read', adminController.markAllNotificationsRead);
router.put('/notifications/:id/read', adminController.markNotificationRead);
router.delete('/notifications/:id', adminController.deleteNotification);

// --- User Management ---
router.get('/users', adminController.getAllUsers);
router.post('/users', adminController.createUser);
router.put('/users/:id/status', adminController.updateUserStatus);
router.put('/users/:id/role', adminController.updateUserRole);
router.put('/users/:id', adminController.updateUser);
router.delete('/users/:id', adminController.deleteUser);

// --- Category Management ---
router.get('/categories', adminController.getAllCategories);
router.post('/categories', adminController.createCategory);
router.delete('/categories/:id', adminController.deleteCategory);

// --- Shop Management ---
router.get('/shops', adminController.getAllShops);
router.post('/shops', upload.single('picture'), adminController.createShop);
router.put('/shops/:id', upload.single('picture'), adminController.updateShop);
router.delete('/shops/:id', adminController.deleteShop);

// --- Event Management ---
router.get('/events', adminController.getAllEvents);
router.post('/events', adminController.createEvent);
router.put('/events/:id', adminController.updateEvent);
router.delete('/events/:id', adminController.deleteEvent);

// --- Content Moderation (Offers & Reviews) ---
router.get('/offers/pending', adminController.getPendingOffers);
router.put('/offers/:id/status', adminController.updateOfferStatus);

router.get('/reviews', adminController.getAllReviews);
router.delete('/reviews/:id', adminController.deleteReview);

module.exports = router;
