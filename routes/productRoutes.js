const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const roleMiddleware = require('../middlewares/roleMiddleware');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/', authMiddleware, roleMiddleware(['SHOP']), productController.create);
router.get('/all', productController.getAll);
router.get('/:id', productController.getById);
router.get('/', productController.getByFilter);
router.put('/:id',  authMiddleware, roleMiddleware(['SHOP']), productController.update);
router.delete('/:id',  authMiddleware, roleMiddleware(['SHOP']), productController.delete);

module.exports = router;
