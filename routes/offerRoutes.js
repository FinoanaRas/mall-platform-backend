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

module.exports = router;