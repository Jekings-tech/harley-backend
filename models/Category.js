const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Category name is required'],
        unique: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    icon: {
        type: String, // URL to category icon/image
        default: ''
    },
    parentCategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        default: null
    },
    level: {
        type: Number,
        default: 0 // 0 = main category, 1 = subcategory
    },
    // For your motorcycle parts categories:
    // Main Categories: Exhaust System, Brakes, Suspension & Steering, etc.
    // Subcategories could be added if needed later
    isActive: {
        type: Boolean,
        default: true
    }
}, { 
    timestamps: true 
});

// Auto-generate level based on parentCategory
categorySchema.pre('save', function(next) {
    if (this.parentCategory) {
        this.level = 1;
    } else {
        this.level = 0;
    }
    next();
});

// Make sure the second word matches whatever you named your schema variable above
module.exports = mongoose.model('Category', categorySchema);