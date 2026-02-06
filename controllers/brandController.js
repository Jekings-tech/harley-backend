const Brand = require('../models/Brand');
const Product = require('../models/Product');

// @desc    Get all brands
exports.getAllBrands = async (req, res) => {
    try {
        const brands = await Brand.find()
            .sort({ name: 1 });
        
        res.status(200).json({
            success: true,
            count: brands.length,
            data: brands
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching brands',
            error: error.message
        });
    }
};

// @desc    Get single brand
exports.getBrand = async (req, res) => {
    try {
        const brand = await Brand.findById(req.params.id);
        
        if (!brand) {
            return res.status(404).json({
                success: false,
                message: 'Brand not found'
            });
        }
        
        res.status(200).json({
            success: true,
            data: brand
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching brand',
            error: error.message
        });
    }
};

// @desc    Create new brand
exports.createBrand = async (req, res) => {
    try {
        const { name, logo, description, establishedYear, website } = req.body;
        
        // CHANGED: Removed country requirement
        if (!name) {
            return res.status(400).json({
                success: false,
                message: 'Brand name is required'
            });
        }
        
        // Check if brand already exists
        const existingBrand = await Brand.findOne({ name });
        if (existingBrand) {
            return res.status(400).json({
                success: false,
                message: 'Brand already exists'
            });
        }
        
        // Get logo URL from Cloudinary if uploaded
        const logoUrl = req.file ? req.file.path : logo;
        
        const brand = await Brand.create({
            name,
            logo: logoUrl,
            description,
            establishedYear,
            website,
            popularModels: Brand.getPopularModels(name)
        });
        
        res.status(201).json({
            success: true,
            message: 'Brand created successfully',
            data: brand
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error creating brand',
            error: error.message
        });
    }
};

// @desc    Update brand
exports.updateBrand = async (req, res) => {
    try {
        let brand = await Brand.findById(req.params.id);
        
        if (!brand) {
            return res.status(404).json({
                success: false,
                message: 'Brand not found'
            });
        }
        
        const { name, description, establishedYear, website } = req.body;
        
        if (name) {
            // Check if new name already exists
            const existingBrand = await Brand.findOne({
                name,
                _id: { $ne: req.params.id }
            });
            
            if (existingBrand) {
                return res.status(400).json({
                    success: false,
                    message: 'Brand name already exists'
                });
            }
            brand.name = name;
        }
        
        if (description !== undefined) brand.description = description;
        if (establishedYear !== undefined) brand.establishedYear = establishedYear;
        if (website !== undefined) brand.website = website;
        
        // Update logo if new file uploaded
        if (req.file) {
            brand.logo = req.file.path;
        }
        
        await brand.save();
        
        res.status(200).json({
            success: true,
            message: 'Brand updated successfully',
            data: brand
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating brand',
            error: error.message
        });
    }
};

// @desc    Delete brand
exports.deleteBrand = async (req, res) => {
    try {
        const brand = await Brand.findById(req.params.id);
        
        if (!brand) {
            return res.status(404).json({
                success: false,
                message: 'Brand not found'
            });
        }
        
        // Check if brand has associated products
        const productCount = await Product.countDocuments({ brand: req.params.id });
        
        if (productCount > 0) {
            return res.status(400).json({
                success: false,
                message: `Cannot delete brand. It has ${productCount} associated product(s).`
            });
        }
        
        await brand.deleteOne();
        
        res.status(200).json({
            success: true,
            message: 'Brand deleted successfully'
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting brand',
            error: error.message
        });
    }
};

// @desc    Get brands by model category (CHANGED from country)
exports.getBrandsByModelCategory = async (req, res) => {
    try {
        // Since we removed country from Brand model, this might need rethinking
        // For now, we'll return all brands
        const brands = await Brand.find().sort({ name: 1 });
        
        res.status(200).json({
            success: true,
            count: brands.length,
            data: brands
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching brands',
            error: error.message
        });
    }
};

// @desc    Seed initial motorcycle brands
exports.seedBrands = async (req, res) => {
    try {
        // Clear existing brands
        await Brand.deleteMany({});
        
        const motorcycleBrands = [
            {
                name: 'Harley Davidson',
                description: 'American motorcycle manufacturer',
                establishedYear: 1903,
                logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Harley-Davidson_logo.svg/1200px-Harley-Davidson_logo.svg.png'
            },
            {
                name: 'Indian Motorcycle',
                description: 'American motorcycle brand',
                establishedYear: 1901,
                logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Indian_Motorcycle_Logo.svg/1200px-Indian_Motorcycle_Logo.svg.png'
            },
            {
                name: 'Triumph',
                description: 'British motorcycle manufacturer',
                establishedYear: 1902,
                logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Triumph_Motorcycles_logo.svg/1200px-Triumph_Motorcycles_logo.svg.png'
            },
            {
                name: 'BMW Motorrad',
                description: 'German motorcycle brand',
                establishedYear: 1923,
                logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/BMW_Motorrad_logo.svg/1200px-BMW_Motorrad_logo.svg.png'
            },
            {
                name: 'Honda',
                description: 'Japanese multinational corporation',
                establishedYear: 1948,
                logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Honda_logo.svg/1200px-Honda_logo.svg.png'
            },
            {
                name: 'Ducati',
                description: 'Italian motorcycle manufacturer',
                establishedYear: 1926,
                logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Ducati_Logo_2012.svg/1200px-Ducati_Logo_2012.svg.png'
            }
        ];
        
        // Add popular models for each brand
        motorcycleBrands.forEach(brand => {
            const popularModels = Brand.getPopularModels(brand.name);
            brand.popularModels = popularModels.map(model => ({
                name: model,
                years: 'Various'
            }));
        });
        
        await Brand.insertMany(motorcycleBrands);
        
        const brands = await Brand.find();
        
        res.status(200).json({
            success: true,
            message: 'Motorcycle brands seeded successfully',
            data: brands
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error seeding brands',
            error: error.message
        });
    }
};