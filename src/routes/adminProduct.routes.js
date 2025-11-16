const express = require('express');
const router = express.Router();

const productController = require('../controller/product.controller.js');
const authenticate = require('../middleware/authenticate');

router.post('/', authenticate, productController.createProduct);
router.post("/creates",authenticate,productController.createMultipleProduct);
router.delete('/:productId', authenticate, productController.deleteProduct);
router.put('/:id', authenticate, productController.updateProduct);


module.exports = router;