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