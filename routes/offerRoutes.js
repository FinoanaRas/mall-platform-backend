const express = require('express');
const router = express.Router();
const offerController = require('../controllers/offerController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

// Créer un offer
router.post('/', authMiddleware, roleMiddleware(['ADMIN', 'SHOP']), offerController.create);

// Lire ses propres offres
router.get('/my-offers', authMiddleware, roleMiddleware(['SHOP']), offerController.getMyOffers);

// Lire tous les offers (Public ou Admin)
router.get('/', offerController.getAll);

// Mettre à jour un offer
router.put('/:id', authMiddleware, roleMiddleware(['ADMIN', 'SHOP']), offerController.update);

// Supprimer un offer
router.delete('/:id', authMiddleware, roleMiddleware(['ADMIN', 'SHOP']), offerController.delete);

module.exports = router;