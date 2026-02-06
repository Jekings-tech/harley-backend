const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    // REQUIRED FIELDS
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    condition: { type: String, required: true },
    motorcycleModel: { type: String, required: true },
    
    // ⭐⭐ CHANGE THESE TO ObjectId REFERENCES ⭐⭐
    category: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Category',
        required: true 
    },
    country: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Country',
        required: true 
    },
    brand: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Brand',
        required: true 
    },
    
    // NEW: Year field
    year: { 
        type: Number, 
        required: false,
        min: [1980, 'Year must be 1980 or later'],
        max: [2024, 'Year cannot be later than 2024']
    },
    
    // OPTIONAL FIELDS
    images: { type: [String], default: [] },
    quantity: { type: Number, default: 0 },
    
    // Default values
    inStock: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    isOnSale: { type: Boolean, default: false }
}, { 
    timestamps: true 
});

module.exports = mongoose.model('Product', productSchema);