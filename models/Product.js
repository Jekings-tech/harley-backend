const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    // Basic Information
    name: {
        type: String,
        required: [true, 'Product name is required'],
        trim: true
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [0, 'Price cannot be negative']
    },
    condition: {
        type: String,
        enum: ['New', 'Used', 'Refurbished'],
        default: 'New'
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        trim: true
    },
    
    // Motorcycle Classification
    country: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Country',
        required: [true, 'Country is required']
    },
    brand: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Brand',
        required: [true, 'Brand is required']
    },
    motorcycleModel: {
        type: String,
        required: [true, 'Motorcycle model is required'],
        trim: true
    },
    
    // Category
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: [true, 'Category is required']
    },
    
    // Images (Multiple)
    images: {
        type: [String],
        default: [],
        validate: {
            validator: function(images) {
                return images.length <= 10; // Limit to 10 images per product
            },
            message: 'Cannot upload more than 10 images per product'
        }
    },
    primaryImage: {
        type: String,
        default: '' // First image in the images array will be primary
    },
    
    // Compatibility & Features
    compatibility: [{
        type: String,
        trim: true
    }],
    features: [{
        type: String,
        trim: true
    }],
    
    // Specifications (Flexible object)
    specifications: {
        material: String,
        weight: String,
        dimensions: String,
        color: String,
        warranty: String,
        // Add more specifications as needed
    },
    
    // Inventory
    inStock: {
        type: Boolean,
        default: true
    },
    quantity: {
        type: Number,
        default: 0,
        min: [0, 'Quantity cannot be negative']
    },
    
    // Marketing & Display
    isFeatured: {
        type: Boolean,
        default: false
    },
    isOnSale: {
        type: Boolean,
        default: false
    },
    salePrice: {
        type: Number,
        min: [0, 'Sale price cannot be negative']
    },
    
    // SEO & URL
    slug: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true
    }
    
}, { 
    timestamps: true 
});

// Auto-generate slug from name before saving
productSchema.pre('save', function(next) {
    if (this.name && (!this.slug || this.isModified('name'))) {
        this.slug = this.name
            .toLowerCase()
            .replace(/[^a-zA-Z0-9\s]/g, '')
            .replace(/\s+/g, '-')
            .substring(0, 100);
    }
    
    // Set primary image to first image if not set
    if (this.images.length > 0 && !this.primaryImage) {
        this.primaryImage = this.images[0];
    }
    
    next();
});

// Create index for faster queries
productSchema.index({ brand: 1, category: 1 });
productSchema.index({ country: 1, brand: 1 });
productSchema.index({ isFeatured: 1 });
productSchema.index({ isOnSale: 1 });

module.exports = mongoose.model('Product', productSchema);