const express = require('express');
const router = express.Router();
const brandController = require('../controllers/brandController');
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
    folder: 'motorcycle_brands',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp', 'svg']
  }
});

const upload = multer({ storage: storage });

// --- ROUTES ---

// GET all brands
router.get('/', brandController.getAllBrands);

// GET brands by country
router.get('/country/:countryId', brandController.getBrandsByCountry);

// GET single brand
router.get('/:id', brandController.getBrand);

// CREATE brand (with logo)
router.post('/', upload.single('logo'), brandController.createBrand);

// UPDATE brand (optional new logo)
router.put('/:id', upload.single('logo'), brandController.updateBrand);

// DELETE brand
router.delete('/:id', brandController.deleteBrand);

// SEED initial motorcycle brands
router.post('/seed', brandController.seedBrands);

module.exports = router;