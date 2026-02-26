const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const cartController = require('../controllers/cart.controller');

router.get('/', authController.authenticate, cartController.getCartList);
router.post('/', authController.authenticate, cartController.addItemToCart);
router.put('/', authController.authenticate, cartController.updateCartQty);
router.delete('/:id', authController.authenticate, cartController.deleteCartItem);
router.get('/qty', authController.authenticate, cartController.getCartQty);

module.exports = router;