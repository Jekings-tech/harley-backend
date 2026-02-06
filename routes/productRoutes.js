const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// ============================================
// SIMPLE WORKING VERSION - NO FILE UPLOAD
// ============================================

// All GET routes
router.get('/', productController.getAllProducts);
router.get('/featured', productController.getFeaturedProducts);
router.get('/brand/:brandId', productController.getProductsByBrand);
// CHANGED: country to modelCategory
router.get('/model-category/:modelCategoryId', productController.getProductsByModelCategory);
router.get('/search', productController.searchProducts);
router.get('/:id', productController.getProductById);

// CREATE product - WORKING WITHOUT FILES
router.post('/', (req, res, next) => {
    console.log('📦 POST /api/products - SIMPLE VERSION');
    req.files = []; // Empty files array
    next();
}, productController.createProduct);

// UPDATE product - WORKING WITHOUT FILES  
router.put('/:id', (req, res, next) => {
    console.log('📦 PUT /api/products/:id - SIMPLE VERSION');
    req.files = [];
    next();
}, productController.updateProduct);

// DELETE product
router.delete('/:id', productController.deleteProduct);

module.exports = router;