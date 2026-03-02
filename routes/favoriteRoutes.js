const express = require('express');
const router = express.Router();
const favoriteController = require('../controllers/favoriteController');
const roleMiddleware = require('../middlewares/roleMiddleware');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/', authMiddleware, roleMiddleware(['CUSTOMER']), favoriteController.create);
router.get('/', authMiddleware, roleMiddleware(['CUSTOMER']), favoriteController.getAllByUser);
router.delete('/:id', authMiddleware, roleMiddleware(['CUSTOMER']), favoriteController.delete);

module.exports = router;