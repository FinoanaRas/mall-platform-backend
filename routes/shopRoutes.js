const express = require('express');
const router = express.Router();
const shopController = require('../controllers/shopController');
const roleMiddleware = require('../middlewares/roleMiddleware');
const authMiddleware = require('../middlewares/authMiddleware');

// Créer un shop
router.post('/', authMiddleware, roleMiddleware(['SHOP']), shopController.create);

// Lire tous les shops
router.get('/', shopController.getAll);
router.get('/categories', shopController.getCategories); // NEW: Public category route
// Obtenir le shop de l'utilisateur connecté
router.get('/my-shop', authMiddleware, roleMiddleware(['SHOP']), shopController.getMyShop);
router.get('/my-shop/stats', authMiddleware, roleMiddleware(['SHOP']), shopController.getStats);

// Mettre à jour son propre profil
router.put('/my-shop/profile', authMiddleware, roleMiddleware(['SHOP']), shopController.updateProfile);

// Lire un shop par ID
router.get('/:id', shopController.getById);

// Mettre à jour un shop (Admin ou Propriétaire)
router.put('/:id', authMiddleware, roleMiddleware(['ADMIN', 'SHOP']), shopController.update);

// Supprimer un shop
router.delete('/:id', authMiddleware, roleMiddleware(['ADMIN']), shopController.delete);

module.exports = router;
