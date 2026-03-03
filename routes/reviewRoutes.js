const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const roleMiddleware = require('../middlewares/roleMiddleware');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/', authMiddleware, roleMiddleware(['CUSTOMER']), reviewController.create);
router.put('/:id', authMiddleware, roleMiddleware(['CUSTOMER']), reviewController.update);
// Get reviews by shop id (shop's review)
router.get('/:id/shop', reviewController.getByTarget);
// Get reviews by product id (product's review)
router.get('/:id/product', reviewController.getByTarget);
// Get reviews by user id (customer)
router.get('/:id/customer', reviewController.getByIdUser);

module.exports = router;