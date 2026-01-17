const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// --- Cloudinary Configuration ---
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'motorcycle_parts',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp']
  }
});

const upload = multer({ storage: storage });

// --- ROUTES ---

// GET all products
router.get('/', productController.getAllProducts);

// GET featured products
router.get('/featured', productController.getFeaturedProducts);

// GET products by brand
router.get('/brand/:brandId', productController.getProductsByBrand);

// GET products by country
router.get('/country/:countryId', productController.getProductsByCountry);

// Search products
router.get('/search', productController.searchProducts);

// GET single product
router.get('/:id', productController.getProductById);

// CREATE product (multiple images)
router.post('/', upload.array('images', 10), productController.createProduct);

// UPDATE product (optional new images)
router.put('/:id', upload.array('images', 10), productController.updateProduct);

// DELETE product
router.delete('/:id', productController.deleteProduct);

module.exports = router;