const express = require('express');
const router = express.Router();
const shopController = require('../controllers/shopController');
const roleMiddleware = require('../middlewares/roleMiddleware');
const authMiddleware = require('../middlewares/AuthMiddleware');

// Créer un shop
router.post('/', authMiddleware,roleMiddleware(['SHOP']),shopController.create);

// Lire tous les shops
router.get('/', shopController.getAll);

// Mettre à jour un shop
router.put('/:id', authMiddleware, roleMiddleware(['ADMIN', 'SHOP']) ,shopController.update);

// Supprimer un shop
router.delete('/:id', authMiddleware, roleMiddleware(['ADMIN']) , shopController.delete);

module.exports = router;