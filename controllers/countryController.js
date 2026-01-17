const Country = require('../models/Country');
const Brand = require('../models/Brand');
const Product = require('../models/Product');

// @desc    Get all countries
exports.getAllCountries = async (req, res) => {
    try {
        const countries = await Country.find().sort({ name: 1 });
        
        res.status(200).json({
            success: true,
            count: countries.length,
            data: countries
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching countries',
            error: error.message
        });
    }
};

// @desc    Get single country with brands
exports.getCountry = async (req, res) => {
    try {
        const country = await Country.findById(req.params.id);
        
        if (!country) {
            return res.status(404).json({
                success: false,
                message: 'Country not found'
            });
        }
        
        // Get brands from this country
        const brands = await Brand.find({ country: country._id })
            .select('name logo')
            .sort({ name: 1 });
        
        // Get product count for this country
        const productCount = await Product.countDocuments({ country: country._id });
        
        res.status(200).json({
            success: true,
            data: {
                ...country.toObject(),
                brands,
                productCount
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching country',
            error: error.message
        });
    }
};

// @desc    Create new country
exports.createCountry = async (req, res) => {
    try {
        const { name, code, motorcycleCulture } = req.body;
        
        if (!name || !code) {
            return res.status(400).json({
                success: false,
                message: 'Country name and code are required'
            });
        }
        
        // Check if country already exists
        const existingCountry = await Country.findOne({
            $or: [{ name }, { code }]
        });
        
        if (existingCountry) {
            return res.status(400).json({
                success: false,
                message: 'Country or code already exists'
            });
        }
        
        // Get flag image URL from Cloudinary if uploaded
        const flagImage = req.file ? req.file.path : '';
        
        const country = await Country.create({
            name,
            code: code.toUpperCase(),
            flagImage,
            motorcycleCulture
        });
        
        res.status(201).json({
            success: true,
            message: 'Country created successfully',
            data: country
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error creating country',
            error: error.message
        });
    }
};

// @desc    Update country
exports.updateCountry = async (req, res) => {
    try {
        let country = await Country.findById(req.params.id);
        
        if (!country) {
            return res.status(404).json({
                success: false,
                message: 'Country not found'
            });
        }
        
        const { name, code, motorcycleCulture } = req.body;
        
        if (name) {
            // Check if new name already exists
            const existingCountry = await Country.findOne({
                name,
                _id: { $ne: req.params.id }
            });
            
            if (existingCountry) {
                return res.status(400).json({
                    success: false,
                    message: 'Country name already exists'
                });
            }
            country.name = name;
        }
        
        if (code) {
            // Check if new code already exists
            const existingCountry = await Country.findOne({
                code: code.toUpperCase(),
                _id: { $ne: req.params.id }
            });
            
            if (existingCountry) {
                return res.status(400).json({
                    success: false,
                    message: 'Country code already exists'
                });
            }
            country.code = code.toUpperCase();
        }
        
        if (motorcycleCulture !== undefined) country.motorcycleCulture = motorcycleCulture;
        
        // Update flag image if new file uploaded
        if (req.file) {
            country.flagImage = req.file.path;
        }
        
        await country.save();
        
        res.status(200).json({
            success: true,
            message: 'Country updated successfully',
            data: country
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating country',
            error: error.message
        });
    }
};

// @desc    Delete country
exports.deleteCountry = async (req, res) => {
    try {
        const country = await Country.findById(req.params.id);
        
        if (!country) {
            return res.status(404).json({
                success: false,
                message: 'Country not found'
            });
        }
        
        // Check if country has associated brands
        const brandCount = await Brand.countDocuments({ country: req.params.id });
        
        if (brandCount > 0) {
            return res.status(400).json({
                success: false,
                message: `Cannot delete country. It has ${brandCount} associated brand(s).`
            });
        }
        
        // Check if country has associated products
        const productCount = await Product.countDocuments({ country: req.params.id });
        
        if (productCount > 0) {
            return res.status(400).json({
                success: false,
                message: `Cannot delete country. It has ${productCount} associated product(s).`
            });
        }
        
        await country.deleteOne();
        
        res.status(200).json({
            success: true,
            message: 'Country deleted successfully'
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting country',
            error: error.message
        });
    }
};

// @desc    Seed initial countries for motorcycle parts
exports.seedCountries = async (req, res) => {
    try {
        // Clear existing countries
        await Country.deleteMany({});
        
        const initialCountries = Country.getDefaultCountries();
        
        await Country.insertMany(initialCountries);
        
        const countries = await Country.find();
        
        res.status(200).json({
            success: true,
            message: 'Countries seeded successfully',
            data: countries
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error seeding countries',
            error: error.message
        });
    }
};