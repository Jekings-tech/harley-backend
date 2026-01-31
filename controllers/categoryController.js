const Category = require('../models/Category');
const Product = require('../models/Product');

// @desc    Get all categories (with product count)
exports.getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find()
            .sort({ name: 1 });
        
        // Get product count for each category
        const categoriesWithCount = await Promise.all(
            categories.map(async (category) => {
                const count = await Product.countDocuments({ category: category._id });
                return {
                    ...category.toObject(),
                    productCount: count
                };
            })
        );
        
        res.status(200).json({
            success: true,
            count: categories.length,
            data: categoriesWithCount
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching categories',
            error: error.message
        });
    }
};

// @desc    Get single category with products
exports.getCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        
        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }
        
        // Get products in this category
        const products = await Product.find({ category: category._id })
            .populate('brand', 'name')
            .populate('country', 'name')
            .limit(50);
        
        res.status(200).json({
            success: true,
            data: {
                ...category.toObject(),
                products
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching category',
            error: error.message
        });
    }
};

// @desc    Create new category (with optional parent)
exports.createCategory = async (req, res, next) => { // ← ADDED 'next' parameter
    try {
        const { name, description, icon, parentCategory } = req.body;
        
        if (!name) {
            return res.status(400).json({
                success: false,
                message: 'Category name is required'
            });
        }
        
        // Check if category already exists
        const existingCategory = await Category.findOne({ name });
        if (existingCategory) {
            return res.status(400).json({
                success: false,
                message: 'Category already exists'
            });
        }
        
        const category = await Category.create({
            name,
            description,
            icon,
            parentCategory
        });
        
        res.status(201).json({
            success: true,
            message: 'Category created successfully',
            data: category
        });
        
    } catch (error) {
        // Use next() if available, otherwise fallback
        if (next) {
            next(error);
        } else {
            res.status(500).json({
                success: false,
                message: 'Error creating category',
                error: error.message
            });
        }
    }
};

// @desc    Update category
exports.updateCategory = async (req, res, next) => { // ← ADDED 'next' parameter
    try {
        let category = await Category.findById(req.params.id);
        
        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }
        
        const { name, description, icon, parentCategory } = req.body;
        
        if (name) {
            // Check if new name already exists (excluding current category)
            const existingCategory = await Category.findOne({
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
        
        if (description !== undefined) category.description = description;
        if (icon !== undefined) category.icon = icon;
        if (parentCategory !== undefined) category.parentCategory = parentCategory;
        
        await category.save();
        
        res.status(200).json({
            success: true,
            message: 'Category updated successfully',
            data: category
        });
        
    } catch (error) {
        // Use next() if available, otherwise fallback
        if (next) {
            next(error);
        } else {
            res.status(500).json({
                success: false,
                message: 'Error updating category',
                error: error.message
            });
        }
    }
};

// @desc    Delete category
exports.deleteCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        
        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }
        
        // Check if category has associated products
        const productCount = await Product.countDocuments({ category: req.params.id });
        
        if (productCount > 0) {
            return res.status(400).json({
                success: false,
                message: `Cannot delete category. It has ${productCount} associated product(s).`
            });
        }
        
        // Check if this category has subcategories
        const subcategoryCount = await Category.countDocuments({ parentCategory: req.params.id });
        
        if (subcategoryCount > 0) {
            return res.status(400).json({
                success: false,
                message: `Cannot delete category. It has ${subcategoryCount} subcategory(s).`
            });
        }
        
        await category.deleteOne();
        
        res.status(200).json({
            success: true,
            message: 'Category deleted successfully'
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting category',
            error: error.message
        });
    }
};

// @desc    Add missing motorcycle parts categories (safe - won't delete existing ones)
exports.seedCategories = async (req, res) => {
    try {
        const motorcycleCategories = [
            { name: 'Exhaust System', description: 'Mufflers, pipes, headers and complete exhaust systems' },
            { name: 'Brakes', description: 'Brake pads, rotors, calipers, and brake lines' },
            { name: 'Suspension & Steering', description: 'Shocks, forks, steering dampers, and handlebars' },
            { name: 'Wheels & Tyres', description: 'Rims, spokes, tires, and wheel accessories' },
            { name: 'Body Parts', description: 'Fairings, fenders, tanks, and frame components' },
            { name: 'Seats & Comfort', description: 'Seats, backrests, cushions, and comfort accessories' },
            { name: 'Handlebars & Controls', description: 'Handlebars, grips, levers, and control cables' },
            { name: 'Lighting & Indicators', description: 'Headlights, taillights, turn signals, and LED kits' },
            { name: 'Engine & Performance Parts', description: 'Cylinders, pistons, cams, and performance upgrades' },
            { name: 'Accessories', description: 'Custom parts, luggage, and motorcycle accessories' },
            { name: 'Electrical & Electronics', description: 'Electrical components, wiring, and electronic accessories' },
            { name: 'Frame & Chassis', description: 'Frame components, chassis parts, and structural elements' },
            { name: 'Luggage & Storage', description: 'Luggage, storage boxes, and related accessories' },
            { name: 'Foot Controls & Pegs', description: 'Footpegs, footrests, and related foot controls' },
            { name: 'Fuel & Intake', description: 'Fuel tanks, carburetors, intake manifolds, and related parts' }
        ];
        
        // Count existing categories first
        const existingCount = await Category.countDocuments();
        console.log(`📊 Found ${existingCount} existing categories`);
        
        // Only add categories that don't exist
        const added = [];
        const skipped = [];
        
        for (const catData of motorcycleCategories) {
            // Check if category already exists (case-insensitive)
            const existing = await Category.findOne({ 
                name: { $regex: new RegExp(`^${catData.name}$`, 'i') } 
            });
            
            if (existing) {
                skipped.push(catData.name);
                console.log(`⏭️ Skipping "${catData.name}" - already exists`);
            } else {
                try {
                    const category = await Category.create(catData);
                    added.push(category);
                    console.log(`✅ Added "${catData.name}"`);
                } catch (err) {
                    console.log(`⚠️ Could not add "${catData.name}": ${err.message}`);
                    skipped.push(catData.name);
                }
            }
        }
        
        const totalNow = await Category.countDocuments();
        
        res.status(200).json({
            success: true,
            message: 'Categories processed successfully',
            stats: {
                added: added.length,
                skipped: skipped.length,
                existingBefore: existingCount,
                totalNow: totalNow
            },
            added: added.map(cat => ({ name: cat.name, id: cat._id })),
            skipped: skipped
        });
        
    } catch (error) {
        console.error('🔥 Seed error:', error);
        res.status(500).json({
            success: false,
            message: 'Error seeding categories',
            error: error.message
        });
    }
};