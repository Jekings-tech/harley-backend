const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// ============================================
// SIMPLE WORKING VERSION - NO FILE UPLOAD
// ============================================

// All GET routes (unchanged)
router.get('/', productController.getAllProducts);
router.get('/featured', productController.getFeaturedProducts);
router.get('/brand/:brandId', productController.getProductsByBrand);
router.get('/country/:countryId', productController.getProductsByCountry);
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