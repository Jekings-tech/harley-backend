const Product = require('../models/Product');
const Category = require('../models/Category');
const Brand = require('../models/Brand');
const Country = require('../models/Country');

// @desc    Get all products with full details
exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find()
            .populate('category', 'name')
            .populate('country', 'name code')
            .populate('brand', 'name logo')
            .sort({ createdAt: -1 });
        
        res.status(200).json({
            success: true,
            count: products.length,
            data: products
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Error fetching products', 
            error: error.message 
        });
    }
};

// @desc    Get single product
exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
            .populate('category', 'name')
            .populate('country', 'name')
            .populate('brand', 'name logo');
            
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }
        res.status(200).json({ success: true, data: product });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching product',
            error: error.message
        });
    }
};

// @desc    Create new product (MOTORCYCLE PARTS VERSION)
exports.createProduct = async (req, res) => {
    try {
        const {
            name,
            category,
            country,
            brand,
            motorcycleModel,
            condition,
            price,
            description,
            compatibility,
            features,
            specifications,
            inStock,
            quantity,
            isFeatured,
            isOnSale,
            salePrice
        } = req.body;
        
        // Required fields validation
        const requiredFields = ['name', 'category', 'country', 'brand', 'motorcycleModel', 'condition', 'price', 'description'];
        for (const field of requiredFields) {
            if (!req.body[field]) {
                return res.status(400).json({
                    success: false,
                    message: `${field} is required`
                });
            }
        }
        
        // Parse arrays if they're sent as strings
        let compatibilityArray = [];
        let featuresArray = [];
        
        if (compatibility) {
            compatibilityArray = Array.isArray(compatibility) 
                ? compatibility 
                : compatibility.split(',').map(item => item.trim());
        }
        
        if (features) {
            featuresArray = Array.isArray(features) 
                ? features 
                : features.split(',').map(item => item.trim());
        }
        
        // Parse specifications if sent as JSON string
        let specsObject = {};
        if (specifications && typeof specifications === 'string') {
            try {
                specsObject = JSON.parse(specifications);
            } catch (e) {
                specsObject = {};
            }
        } else if (specifications) {
            specsObject = specifications;
        }
        
        // Get image URLs from Cloudinary upload
        const images = req.files ? req.files.map(file => file.path) : [];
        
        if (images.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'At least one image is required'
            });
        }
        
        const product = await Product.create({
            name,
            category,
            country,
            brand,
            motorcycleModel,
            condition,
            price: parseFloat(price),
            description,
            images,
            primaryImage: images[0],
            compatibility: compatibilityArray,
            features: featuresArray,
            specifications: specsObject,
            inStock: inStock === 'true' || inStock === true,
            quantity: quantity ? parseInt(quantity) : 0,
            isFeatured: isFeatured === 'true' || isFeatured === true,
            isOnSale: isOnSale === 'true' || isOnSale === true,
            salePrice: salePrice ? parseFloat(salePrice) : null
        });
        
        // Get full populated product
        const populatedProduct = await Product.findById(product._id)
            .populate('category', 'name')
            .populate('country', 'name')
            .populate('brand', 'name logo');
        
        res.status(201).json({
            success: true,
            message: 'Product created successfully',
            data: populatedProduct
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error creating product',
            error: error.message
        });
    }
};

// @desc    Update product
exports.updateProduct = async (req, res) => {
    try {
        let product = await Product.findById(req.params.id);
        
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }
        
        const {
            name,
            category,
            country,
            brand,
            motorcycleModel,
            condition,
            price,
            description,
            compatibility,
            features,
            specifications,
            inStock,
            quantity,
            isFeatured,
            isOnSale,
            salePrice
        } = req.body;
        
        // Update basic fields if provided
        if (name) product.name = name;
        if (category) product.category = category;
        if (country) product.country = country;
        if (brand) product.brand = brand;
        if (motorcycleModel) product.motorcycleModel = motorcycleModel;
        if (condition) product.condition = condition;
        if (price) product.price = parseFloat(price);
        if (description) product.description = description;
        
        // Update arrays if provided
        if (compatibility) {
            product.compatibility = Array.isArray(compatibility) 
                ? compatibility 
                : compatibility.split(',').map(item => item.trim());
        }
        
        if (features) {
            product.features = Array.isArray(features) 
                ? features 
                : features.split(',').map(item => item.trim());
        }
        
        // Update specifications
        if (specifications) {
            if (typeof specifications === 'string') {
                try {
                    product.specifications = JSON.parse(specifications);
                } catch (e) {
                    // Keep existing specs if JSON is invalid
                }
            } else {
                product.specifications = specifications;
            }
        }
        
        // Update boolean/number fields
        if (inStock !== undefined) product.inStock = inStock === 'true' || inStock === true;
        if (quantity !== undefined) product.quantity = parseInt(quantity);
        if (isFeatured !== undefined) product.isFeatured = isFeatured === 'true' || isFeatured === true;
        if (isOnSale !== undefined) product.isOnSale = isOnSale === 'true' || isOnSale === true;
        if (salePrice !== undefined) product.salePrice = salePrice ? parseFloat(salePrice) : null;
        
        // Update images if new ones uploaded
        if (req.files && req.files.length > 0) {
            // Add new images to existing images
            const newImages = req.files.map(file => file.path);
            product.images = [...product.images, ...newImages];
            // If no primary image, set first new image as primary
            if (!product.primaryImage && newImages.length > 0) {
                product.primaryImage = newImages[0];
            }
        }
        
        await product.save();
        
        const updatedProduct = await Product.findById(product._id)
            .populate('category', 'name')
            .populate('country', 'name')
            .populate('brand', 'name logo');
        
        res.status(200).json({
            success: true,
            message: 'Product updated successfully',
            data: updatedProduct
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating product',
            error: error.message
        });
    }
};

// @desc    Delete product
exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }
        
        // Note: In production, you should also delete images from Cloudinary
        // const cloudinary = require('cloudinary').v2;
        // for (const imageUrl of product.images) {
        //     const publicId = imageUrl.split('/').pop().split('.')[0];
        //     await cloudinary.uploader.destroy(publicId);
        // }
        
        await product.deleteOne();
        
        res.status(200).json({
            success: true,
            message: 'Product deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting product',
            error: error.message
        });
    }
};

// @desc    Search products
exports.searchProducts = async (req, res) => {
    try {
        const { search, category, brand, country, condition } = req.query;
        let query = {};
        
        // Text search
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { motorcycleModel: { $regex: search, $options: 'i' } }
            ];
        }
        
        // Filter by category
        if (category) {
            query.category = category;
        }
        
        // Filter by brand
        if (brand) {
            query.brand = brand;
        }
        
        // Filter by country
        if (country) {
            query.country = country;
        }
        
        // Filter by condition
        if (condition) {
            query.condition = condition;
        }
        
        const products = await Product.find(query)
            .populate('category', 'name')
            .populate('country', 'name')
            .populate('brand', 'name logo')
            .sort({ createdAt: -1 });
        
        res.status(200).json({
            success: true,
            count: products.length,
            data: products
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Search failed',
            error: error.message
        });
    }
};

// @desc    Get featured products
exports.getFeaturedProducts = async (req, res) => {
    try {
        const products = await Product.find({ isFeatured: true })
            .populate('category', 'name')
            .populate('country', 'name')
            .populate('brand', 'name logo')
            .limit(10)
            .sort({ createdAt: -1 });
        
        res.status(200).json({
            success: true,
            count: products.length,
            data: products
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching featured products',
            error: error.message
        });
    }
};

// @desc    Get products by brand
exports.getProductsByBrand = async (req, res) => {
    try {
        const products = await Product.find({ brand: req.params.brandId })
            .populate('category', 'name')
            .populate('country', 'name')
            .populate('brand', 'name logo')
            .sort({ createdAt: -1 });
        
        res.status(200).json({
            success: true,
            count: products.length,
            data: products
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching products by brand',
            error: error.message
        });
    }
};

// @desc    Get products by country
exports.getProductsByCountry = async (req, res) => {
    try {
        const products = await Product.find({ country: req.params.countryId })
            .populate('category', 'name')
            .populate('country', 'name')
            .populate('brand', 'name logo')
            .sort({ createdAt: -1 });
        
        res.status(200).json({
            success: true,
            count: products.length,
            data: products
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching products by country',
            error: error.message
        });
    }
};