const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const authMiddleware = require('../middlewares/authMiddleware');
const { upload } = require('../config/cloudinary');

router.post('/', authMiddleware, upload.single('picture'), productController.create);
router.get('/my-products', authMiddleware, productController.getMyProducts);
router.put('/:id', authMiddleware, upload.single('picture'), productController.update);
router.delete('/:id', authMiddleware, productController.delete);

module.exports = router;
