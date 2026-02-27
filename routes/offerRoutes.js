const express = require('express');
const router = express.Router();
const offerController = require('../controllers/offerController');

// Créer un offer
router.post('/', offerController.create);

// Lire tous les offers
router.get('/', offerController.getAll);

// Mettre à jour un offer
router.put('/:id', offerController.update);

// Supprimer un offer
router.delete('/:id', offerController.delete);

// pending offers of a shop
router.get('/shop/pending/:id', offerController.findPendingOffers);
router.get('/shop/pending', offerController.findPendingOffers);

// active offers of a shop
router.get('/shop/active/:id', offerController.findActiveOffers);
router.get('/shop/active', offerController.findActiveOffers);

// historique offers of a shop
router.get('/shop/historic/:id', offerController.findHistoricOffers);
router.get('/shop/historic', offerController.findHistoricOffers);

module.exports = router;