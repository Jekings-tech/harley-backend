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
    folder: 'autoparts_business',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp']
  }
});

const upload = multer({ storage: storage });

// --- ROUTES ---

router.get('/', productController.getAllProducts);

// 1. FIXED: Your frontend sends search as a query parameter (?search=...) 
// and the controller expects req.query, so change this:
router.get('/search', productController.searchProducts); 

// 2. FIXED: Changed 'getProduct' to 'getProductById' to match your controller
router.get('/:id', productController.getProductById); 

router.post('/', upload.array('images', 10), productController.createProduct);
router.put('/:id', upload.array('images', 10), productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

module.exports = router;