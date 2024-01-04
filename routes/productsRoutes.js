const express = require('express');

const router = express.Router();
const productsOperation = require('../controllers/productsOperations');

router.get('/', productsOperation.getAllProducts); // showing all products
router.get('/:id', productsOperation.getProductById); // retrieving one product by its id
router.put('/:id', productsOperation.updateProductName); // see the name of the product by id
router.get('/size/:size', productsOperation.getProductsBySize); // show all sizes available for an item

// Future routes for adding categories, subcategories, brands, and models will be added here

module.exports = router;
