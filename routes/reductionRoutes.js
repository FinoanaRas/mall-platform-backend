const express = require('express');
const router = express.Router();
const reductionController = require('../controllers/reductionController');
const roleMiddleware = require('../middlewares/roleMiddleware');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/', authMiddleware, roleMiddleware(['SHOP']), reductionController.create);
router.get('/:id/product', reductionController.getByProduct);
router.get('/:id/offer', reductionController.getByOffer);
router.put('/:id', authMiddleware, roleMiddleware(['SHOP']), reductionController.update);
router.delete('/:id', authMiddleware, roleMiddleware(['SHOP']), reductionController.delete);

module.exports = router;