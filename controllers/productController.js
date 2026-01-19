const Product = require('../models/Product');

// @desc    Get all products
exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });
        
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
        const product = await Product.findById(req.params.id);
            
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

// 
       
       
        
exports.createProduct = async (req, res) => {
    console.log('🚀 CREATE PRODUCT - NO IMAGES REQUIRED');
    
    try {
        // Get data
        const { 
            name, 
            price, 
            description, 
            motorcycleModel, 
            condition, 
            category, 
            country, 
            brand,
            quantity,
            compatibility,
            features
        } = req.body;
        
        console.log('📥 Received data:', {
            name, price, description, motorcycleModel, condition, category, country, brand
        });
        
        // Simple validation
        const requiredFields = ['name', 'price', 'description', 'category', 'country', 'brand'];
        const missingFields = requiredFields.filter(field => !req.body[field]);
        
        if (missingFields.length > 0) {
            return res.status(400).json({
                success: false,
                message: `Missing required fields: ${missingFields.join(', ')}`
            });
        }
        
        // Use placeholder image for now
        const images = ['https://via.placeholder.com/500x500/cccccc/969696?text=Product+Image'];
        
        // Parse arrays if provided
        const compatibilityArray = compatibility 
            ? (Array.isArray(compatibility) ? compatibility : String(compatibility).split(',').map(item => item.trim()))
            : [];
            
        const featuresArray = features
            ? (Array.isArray(features) ? features : String(features).split(',').map(item => item.trim()))
            : [];
        
        // Create product
        const productData = {
            name: String(name),
            price: parseFloat(price) || 0,
            description: String(description),
            motorcycleModel: motorcycleModel || 'Generic',
            condition: condition || 'New',
            category: String(category),
            country: String(country),
            brand: String(brand),
            images: images, // ← PLACEHOLDER IMAGE
            quantity: parseInt(quantity) || 0,
            compatibility: compatibilityArray,
            features: featuresArray,
            inStock: true,
            isFeatured: false,
            primaryImage: images[0]
        };
        
        console.log('📝 Creating product with:', productData);
        
        const product = await Product.create(productData);
        
        console.log('✅ Product created successfully:', product._id);
        
        res.status(201).json({
            success: true,
            message: 'Product created successfully',
            data: product
        });
        
    } catch (error) {
        console.error('❌ Create error:', error.message);
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
        const product = await Product.findById(req.params.id);
        
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }
        
        console.log('🔄 Updating product:', req.params.id);
        console.log('📦 Update data:', req.body);
        console.log('📸 New files:', req.files ? req.files.length : 0);
        
        // Update only provided fields
        const updates = req.body;
        
        // Simple field updates
        if (updates.name !== undefined) product.name = String(updates.name);
        if (updates.category !== undefined) product.category = String(updates.category);
        if (updates.country !== undefined) product.country = String(updates.country);
        if (updates.brand !== undefined) product.brand = String(updates.brand);
        if (updates.motorcycleModel !== undefined) product.motorcycleModel = String(updates.motorcycleModel);
        if (updates.condition !== undefined) product.condition = String(updates.condition);
        if (updates.price !== undefined) product.price = parseFloat(updates.price) || 0;
        if (updates.description !== undefined) product.description = String(updates.description);
        if (updates.quantity !== undefined) product.quantity = parseInt(updates.quantity) || 0;
        
        // Boolean fields
        if (updates.inStock !== undefined) product.inStock = updates.inStock === 'true' || updates.inStock === true;
        if (updates.isFeatured !== undefined) product.isFeatured = updates.isFeatured === 'true' || updates.isFeatured === true;
        if (updates.isOnSale !== undefined) product.isOnSale = updates.isOnSale === 'true' || updates.isOnSale === true;
        if (updates.salePrice !== undefined) product.salePrice = updates.salePrice ? parseFloat(updates.salePrice) : null;
        
        // Arrays
        if (updates.compatibility !== undefined) {
            product.compatibility = Array.isArray(updates.compatibility) 
                ? updates.compatibility 
                : String(updates.compatibility).split(',').map(item => item.trim()).filter(item => item);
        }
        
        if (updates.features !== undefined) {
            product.features = Array.isArray(updates.features) 
                ? updates.features 
                : String(updates.features).split(',').map(item => item.trim()).filter(item => item);
        }
        
        // Specifications
        if (updates.specifications !== undefined) {
            try {
                product.specifications = typeof updates.specifications === 'string' 
                    ? JSON.parse(updates.specifications) 
                    : updates.specifications;
            } catch (e) {
                console.log('⚠️ Could not parse specifications:', e.message);
            }
        }
        
        // Update images if new ones uploaded
        if (req.files && req.files.length > 0) {
            const newImages = req.files.map(file => file.path);
            product.images = [...product.images, ...newImages];
            // Set primary image if not set
            if (!product.primaryImage && newImages.length > 0) {
                product.primaryImage = newImages[0];
            }
        }
        
        await product.save();
        
        console.log('✅ Product updated successfully:', product._id);
        
        res.status(200).json({
            success: true,
            message: 'Product updated successfully',
            data: product
        });
    } catch (error) {
        console.error('❌ Update product error:', error);
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
        const { search } = req.query;
        let query = {};
        
        // Text search
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { motorcycleModel: { $regex: search, $options: 'i' } },
                { category: { $regex: search, $options: 'i' } },
                { country: { $regex: search, $options: 'i' } },
                { brand: { $regex: search, $options: 'i' } }
            ];
        }
        
        const products = await Product.find(query).sort({ createdAt: -1 });
        
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