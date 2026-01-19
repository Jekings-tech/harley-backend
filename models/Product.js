// models/Product.js - SIMPLEST POSSIBLE VERSION
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    // REQUIRED FIELDS ONLY
    name: String,
    price: Number,
    description: String,
    condition: String,
    motorcycleModel: String,
    category: String,        // Changed from ObjectId to String
    country: String,         // Changed from ObjectId to String  
    brand: String,           // Changed from ObjectId to String
    
    // OPTIONAL FIELDS
    images: [String],
    quantity: Number,
    
    // Default values
    inStock: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    isOnSale: { type: Boolean, default: false }
}, { 
    timestamps: true 
});

// NO pre-save hooks
// NO middleware
// NO next() anywhere
// NO complex validators
// NO references (using strings instead of ObjectId)

module.exports = mongoose.model('Product', productSchema);