const express = require('express');
const router = express.Router();
const shopController = require('../controllers/shopController');
const roleMiddleware = require('../middlewares/roleMiddleware');
const authMiddleware = require('../middlewares/authMiddleware');
const { upload } = require('../config/cloudinary');

// Créer un shop
router.post('/', authMiddleware, roleMiddleware(['ADMIN', 'SHOP']), upload.single('picture'), shopController.create);

// Lire tous les shops
router.get('/', shopController.getAll);
router.get('/categories', shopController.getCategories); // NEW: Public category route
// Obtenir le shop de l'utilisateur connecté
router.get('/my-shop', authMiddleware, roleMiddleware(['SHOP']), shopController.getMyShop);
router.get('/my-shop/stats', authMiddleware, roleMiddleware(['SHOP']), shopController.getStats);

// Mettre à jour son propre profil
router.put('/my-shop/profile', authMiddleware, roleMiddleware(['SHOP']), upload.single('picture'), shopController.updateProfile);

// Lire un shop par ID
router.get('/:id', shopController.getById);

// Mettre à jour un shop (Admin ou Propriétaire)
router.put('/:id', authMiddleware, roleMiddleware(['ADMIN', 'SHOP']), upload.single('picture'), shopController.update);

// Supprimer un shop
router.delete('/:id', authMiddleware, roleMiddleware(['ADMIN']), shopController.delete);

module.exports = router;
