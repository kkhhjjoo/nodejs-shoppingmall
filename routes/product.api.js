const express = require('express');
const authController = require('../controllers/auth.controller');
const productController = require('../controllers/product.controller');
const multer = require('multer');
const upload = multer({dist: 'uploads/'})
const router = express.Router();

router.post('/', authController.authenticate, authController.checkAdminPermission,
upload.single('image'),  
productController.createProduct);

router.get('/', productController.getProducts);
router.put('/:id', authController.authenticate, authController.checkAdminPermission, productController.updateProduct);
router.delete('/:id', authController.authenticate, authController.checkAdminPermission, productController.deleteProduct);
router.get('/:id', productController.getProductById);

module.exports = router;