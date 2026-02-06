const express = require('express');
const router = express.Router();
const modelCategoryController = require('../controllers/motorcycleModelCategoryController');
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
    folder: 'motorcycle_category_icons', // Changed folder name
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp', 'svg']
  }
});

const upload = multer({ storage: storage });

// --- ROUTES ---

// GET all motorcycle model categories
router.get('/', modelCategoryController.getAllCategories);

// GET single category with details
router.get('/:id', modelCategoryController.getCategory);

// GET popular models by category
router.get('/:id/popular-models', modelCategoryController.getPopularModelsByCategory);

// CREATE model category (with icon)
router.post('/', upload.single('icon'), modelCategoryController.createCategory);

// UPDATE model category (optional new icon)
router.put('/:id', upload.single('icon'), modelCategoryController.updateCategory);

// DELETE model category
router.delete('/:id', modelCategoryController.deleteCategory);

// SEED initial categories
router.post('/seed', modelCategoryController.seedCategories);

module.exports = router;