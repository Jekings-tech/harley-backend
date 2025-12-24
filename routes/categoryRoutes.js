const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');



router.post('/seed', categoryController.seedCategories);
// @route   GET /api/categories
// @desc    Get all categories
router.get('/', categoryController.getAllCategories);

// @route   GET /api/categories/:id
// @desc    Get single category
router.get('/:id', categoryController.getCategory);

// @route   POST /api/categories
// @desc    Create new category
router.post('/', categoryController.createCategory);

// @route   PUT /api/categories/:id
// @desc    Update category
router.put('/:id', categoryController.updateCategory);

// @route   DELETE /api/categories/:id
// @desc    Delete category
router.delete('/:id', categoryController.deleteCategory);

// @route   POST /api/categories/seed
// @desc    Seed initial categories


module.exports = router;