const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

// GET all categories
router.get('/', categoryController.getAllCategories);

// GET single category with products
router.get('/:id', categoryController.getCategory);

// CREATE category
router.post('/', categoryController.createCategory);

// UPDATE category
router.put('/:id', categoryController.updateCategory);

// DELETE category
router.delete('/:id', categoryController.deleteCategory);

// SEED motorcycle parts categories
router.post('/seed', categoryController.seedCategories);

module.exports = router;