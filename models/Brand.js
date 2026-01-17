const mongoose = require('mongoose');

const brandSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Brand name is required'],
        unique: true,
        trim: true
    },
    country: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Country',
        required: [true, 'Country is required']
    },
    logo: {
        type: String, // URL to logo image (Cloudinary)
        default: ''
    },
    description: {
        type: String,
        trim: true
    },
    popularModels: [{
        name: String,
        years: String // e.g., "2015-2023"
    }],
    establishedYear: {
        type: Number
    },
    website: {
        type: String,
        trim: true
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Index for faster queries
brandSchema.index({ country: 1, name: 1 });
brandSchema.index({ isActive: 1 });

// Static method to get popular models by brand
brandSchema.statics.getPopularModels = function(brandName) {
    const brandModels = {
        'Harley Davidson': ['Sportster', 'Softail', 'Touring', 'Street Glide', 'Road King'],
        'Indian Motorcycle': ['Scout', 'Chief', 'Chieftain', 'Springfield'],
        'Triumph': ['Bonneville', 'Speed Triple', 'Tiger', 'Rocket 3'],
        'BMW Motorrad': ['R 1250 GS', 'S 1000 RR', 'R nineT', 'K 1600'],
        'Honda': ['CBR', 'CRF', 'Gold Wing', 'Rebel', 'Africa Twin'],
        'Ducati': ['Panigale', 'Monster', 'Multistrada', 'Scrambler', 'Diavel']
    };
    return brandModels[brandName] || [];
};

module.exports = mongoose.model('Brand', brandSchema);