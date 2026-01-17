const express = require('express');
const router = express.Router();
const countryController = require('../controllers/countryController');
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
    folder: 'country_flags',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp', 'svg']
  }
});

const upload = multer({ storage: storage });

// --- ROUTES ---

// GET all countries
router.get('/', countryController.getAllCountries);

// GET single country with brands
router.get('/:id', countryController.getCountry);

// CREATE country (with flag)
router.post('/', upload.single('flagImage'), countryController.createCountry);

// UPDATE country (optional new flag)
router.put('/:id', upload.single('flagImage'), countryController.updateCountry);

// DELETE country
router.delete('/:id', countryController.deleteCountry);

// SEED initial countries
router.post('/seed', countryController.seedCountries);

module.exports = router;