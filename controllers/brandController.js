const Brand = require('../models/Brand');
const Country = require('../models/Country');
const Product = require('../models/Product');

// @desc    Get all brands with country details
exports.getAllBrands = async (req, res) => {
    try {
        const brands = await Brand.find()
            .populate('country', 'name code flagImage')
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
        const brand = await Brand.findById(req.params.id)
            .populate('country', 'name code');
        
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
        const { name, country, logo, description, establishedYear, website } = req.body;
        
        if (!name || !country) {
            return res.status(400).json({
                success: false,
                message: 'Brand name and country are required'
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
        
        // Check if country exists
        const countryExists = await Country.findById(country);
        if (!countryExists) {
            return res.status(400).json({
                success: false,
                message: 'Selected country does not exist'
            });
        }
        
        // Get logo URL from Cloudinary if uploaded
        const logoUrl = req.file ? req.file.path : logo;
        
        const brand = await Brand.create({
            name,
            country,
            logo: logoUrl,
            description,
            establishedYear,
            website,
            popularModels: Brand.getPopularModels(name)
        });
        
        const populatedBrand = await Brand.findById(brand._id)
            .populate('country', 'name');
        
        res.status(201).json({
            success: true,
            message: 'Brand created successfully',
            data: populatedBrand
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
        
        const { name, country, description, establishedYear, website } = req.body;
        
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
        
        if (country) brand.country = country;
        if (description !== undefined) brand.description = description;
        if (establishedYear !== undefined) brand.establishedYear = establishedYear;
        if (website !== undefined) brand.website = website;
        
        // Update logo if new file uploaded
        if (req.file) {
            brand.logo = req.file.path;
        }
        
        await brand.save();
        
        const updatedBrand = await Brand.findById(brand._id)
            .populate('country', 'name');
        
        res.status(200).json({
            success: true,
            message: 'Brand updated successfully',
            data: updatedBrand
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

// @desc    Get brands by country
exports.getBrandsByCountry = async (req, res) => {
    try {
        const brands = await Brand.find({ country: req.params.countryId })
            .populate('country', 'name code')
            .sort({ name: 1 });
        
        res.status(200).json({
            success: true,
            count: brands.length,
            data: brands
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching brands by country',
            error: error.message
        });
    }
};

// @desc    Seed initial motorcycle brands
exports.seedBrands = async (req, res) => {
    try {
        // Clear existing brands
        await Brand.deleteMany({});
        
        // Get country IDs first
        const countries = await Country.find();
        const countryMap = {};
        countries.forEach(country => {
            countryMap[country.name] = country._id;
        });
        
        const motorcycleBrands = [
            {
                name: 'Harley Davidson',
                country: countryMap['American'],
                description: 'American motorcycle manufacturer',
                establishedYear: 1903
            },
            {
                name: 'Indian Motorcycle',
                country: countryMap['American'],
                description: 'American motorcycle brand',
                establishedYear: 1901
            },
            {
                name: 'Triumph',
                country: countryMap['British'],
                description: 'British motorcycle manufacturer',
                establishedYear: 1902
            },
            {
                name: 'BMW Motorrad',
                country: countryMap['German'],
                description: 'German motorcycle brand',
                establishedYear: 1923
            },
            {
                name: 'Honda',
                country: countryMap['Japanese'],
                description: 'Japanese multinational corporation',
                establishedYear: 1948
            },
            {
                name: 'Ducati',
                country: countryMap['Italian'],
                description: 'Italian motorcycle manufacturer',
                establishedYear: 1926
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
        
        const populatedBrands = await Brand.find()
            .populate('country', 'name');
        
        res.status(200).json({
            success: true,
            message: 'Motorcycle brands seeded successfully',
            data: populatedBrands
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error seeding brands',
            error: error.message
        });
    }
};