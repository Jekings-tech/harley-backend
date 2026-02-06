const mongoose = require('mongoose');

const motorcycleModelCategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Model category name is required'],
        unique: true,
        trim: true
    },
    code: {
        type: String,
        unique: true,
        uppercase: true,
        trim: true,
        required: [true, 'Model category code is required']
    },
    icon: {
        type: String, // URL to icon image (Cloudinary)
        default: ''
    },
    description: {
        type: String,
        trim: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    popularModels: [{
        name: String,
        years: String
    }]
}, {
    timestamps: true
});

// Pre-defined categories for your motorcycle models
motorcycleModelCategorySchema.statics.getDefaultCategories = function() {
    return [
        { 
            name: 'Touring Models', 
            code: 'TOUR', 
            description: 'Long-distance comfort bikes with luggage capacity',
            popularModels: [
                { name: 'Road King', years: '1994-Present' },
                { name: 'Electra Glide', years: '1965-Present' },
                { name: 'Street Glide', years: '2006-Present' }
            ]
        },
        { 
            name: 'Cruiser Models', 
            code: 'CRSR', 
            description: 'Classic styled bikes with relaxed riding position',
            popularModels: [
                { name: 'Fat Boy', years: '1990-Present' },
                { name: 'Heritage Classic', years: '1986-Present' },
                { name: 'Softail Deluxe', years: '2005-Present' }
            ]
        },
        { 
            name: 'Softail Models', 
            code: 'SFTL', 
            description: 'Hidden rear suspension for classic hardtail look',
            popularModels: [
                { name: 'Softail Standard', years: '1984-Present' },
                { name: 'Breakout', years: '2013-Present' },
                { name: 'Fat Bob', years: '2008-Present' }
            ]
        },
        { 
            name: 'Dyna Models', 
            code: 'DYNA', 
            description: 'Traditional twin-shock rear suspension (discontinued 2017)',
            popularModels: [
                { name: 'Dyna Super Glide', years: '1991-2017' },
                { name: 'Dyna Street Bob', years: '2006-2017' },
                { name: 'Dyna Low Rider', years: '1980-2017' }
            ]
        },
        { 
            name: 'Sportster Models', 
            code: 'SPRT', 
            description: 'Entry-level and nimble sport cruisers',
            popularModels: [
                { name: 'Sportster 883', years: '1986-Present' },
                { name: 'Sportster 1200', years: '1993-Present' },
                { name: 'Iron 883', years: '2009-Present' }
            ]
        },
        { 
            name: 'Sport-Touring', 
            code: 'SPTR', 
            description: 'Performance-oriented bikes with touring capabilities',
            popularModels: [
                { name: 'Pan America', years: '2021-Present' },
                { name: 'LiveWire', years: '2020-Present' }
            ]
        }
    ];
};

module.exports = mongoose.model('MotorcycleModelCategory', motorcycleModelCategorySchema);