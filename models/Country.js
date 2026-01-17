const mongoose = require('mongoose');

const countrySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Country name is required'],
        unique: true,
        trim: true
    },
    code: {
        type: String,
        unique: true,
        uppercase: true,
        trim: true,
        required: [true, 'Country code is required']
    },
    flagImage: {
        type: String, // URL to flag image (Cloudinary)
        default: ''
    },
    motorcycleCulture: {
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

// Pre-defined codes for your countries
countrySchema.statics.getDefaultCountries = function() {
    return [
        { name: 'American', code: 'US', motorcycleCulture: 'Cruiser & Custom' },
        { name: 'British', code: 'UK', motorcycleCulture: 'Classic & Café Racer' },
        { name: 'German', code: 'DE', motorcycleCulture: 'Engineering & Touring' },
        { name: 'Japanese', code: 'JP', motorcycleCulture: 'Reliable & Versatile' },
        { name: 'Italian', code: 'IT', motorcycleCulture: 'Sport & Performance' }
    ];
};

module.exports = mongoose.model('Country', countrySchema);