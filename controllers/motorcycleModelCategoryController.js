const MotorcycleModelCategory = require('../models/MotorcycleModelCategory');
const Brand = require('../models/Brand');
const Product = require('../models/Product');

// @desc    Get all motorcycle model categories
exports.getAllCategories = async (req, res) => {
    try {
        const categories = await MotorcycleModelCategory.find()
            .sort({ name: 1 });
        
        res.status(200).json({
            success: true,
            count: categories.length,
            data: categories
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching motorcycle model categories',
            error: error.message
        });
    }
};

// @desc    Get single category with details
exports.getCategory = async (req, res) => {
    try {
        const category = await MotorcycleModelCategory.findById(req.params.id);
        
        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Model category not found'
            });
        }
        
        // Get products in this category
        const products = await Product.find({ modelCategory: category.name })
            .select('name price images condition')
            .sort({ name: 1 })
            .limit(10);
        
        // Get product count for this category
        const productCount = await Product.countDocuments({ modelCategory: category.name });
        
        res.status(200).json({
            success: true,
            data: {
                ...category.toObject(),
                recentProducts: products,
                productCount
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching model category',
            error: error.message
        });
    }
};

// @desc    Create new motorcycle model category
exports.createCategory = async (req, res) => {
    try {
        const { name, code, description } = req.body;
        
        if (!name || !code) {
            return res.status(400).json({
                success: false,
                message: 'Category name and code are required'
            });
        }
        
        // Check if category already exists
        const existingCategory = await MotorcycleModelCategory.findOne({
            $or: [{ name }, { code }]
        });
        
        if (existingCategory) {
            return res.status(400).json({
                success: false,
                message: 'Category name or code already exists'
            });
        }
        
        // Get icon URL from Cloudinary if uploaded
        const icon = req.file ? req.file.path : '';
        
        const category = await MotorcycleModelCategory.create({
            name,
            code: code.toUpperCase(),
            icon,
            description,
            popularModels: req.body.popularModels || []
        });
        
        res.status(201).json({
            success: true,
            message: 'Motorcycle model category created successfully',
            data: category
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error creating model category',
            error: error.message
        });
    }
};

// @desc    Update motorcycle model category
exports.updateCategory = async (req, res) => {
    try {
        let category = await MotorcycleModelCategory.findById(req.params.id);
        
        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Model category not found'
            });
        }
        
        const { name, code, description, popularModels } = req.body;
        
        if (name) {
            // Check if new name already exists
            const existingCategory = await MotorcycleModelCategory.findOne({
                name,
                _id: { $ne: req.params.id }
            });
            
            if (existingCategory) {
                return res.status(400).json({
                    success: false,
                    message: 'Category name already exists'
                });
            }
            category.name = name;
        }
        
        if (code) {
            // Check if new code already exists
            const existingCategory = await MotorcycleModelCategory.findOne({
                code: code.toUpperCase(),
                _id: { $ne: req.params.id }
            });
            
            if (existingCategory) {
                return res.status(400).json({
                    success: false,
                    message: 'Category code already exists'
                });
            }
            category.code = code.toUpperCase();
        }
        
        if (description !== undefined) category.description = description;
        if (popularModels !== undefined) category.popularModels = popularModels;
        
        // Update icon if new file uploaded
        if (req.file) {
            category.icon = req.file.path;
        }
        
        await category.save();
        
        res.status(200).json({
            success: true,
            message: 'Model category updated successfully',
            data: category
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating model category',
            error: error.message
        });
    }
};

// @desc    Delete motorcycle model category
exports.deleteCategory = async (req, res) => {
    try {
        const category = await MotorcycleModelCategory.findById(req.params.id);
        
        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Model category not found'
            });
        }
        
        // Check if category has associated products
        const productCount = await Product.countDocuments({ 
            modelCategory: category.name 
        });
        
        if (productCount > 0) {
            return res.status(400).json({
                success: false,
                message: `Cannot delete category. It has ${productCount} associated product(s).`
            });
        }
        
        await category.deleteOne();
        
        res.status(200).json({
            success: true,
            message: 'Model category deleted successfully'
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting model category',
            error: error.message
        });
    }
};

// @desc    Seed initial motorcycle model categories
exports.seedCategories = async (req, res) => {
    try {
        // Clear existing categories
        await MotorcycleModelCategory.deleteMany({});
        
        const initialCategories = MotorcycleModelCategory.getDefaultCategories();
        
        await MotorcycleModelCategory.insertMany(initialCategories);
        
        const categories = await MotorcycleModelCategory.find();
        
        res.status(200).json({
            success: true,
            message: 'Motorcycle model categories seeded successfully',
            data: categories
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error seeding categories',
            error: error.message
        });
    }
};

// @desc    Get popular models by category
exports.getPopularModelsByCategory = async (req, res) => {
    try {
        const category = await MotorcycleModelCategory.findById(req.params.id)
            .select('name popularModels');
        
        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Model category not found'
            });
        }
        
        res.status(200).json({
            success: true,
            data: {
                category: category.name,
                popularModels: category.popularModels || []
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching popular models',
            error: error.message
        });
    }
};