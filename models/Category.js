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
        type: String,
        default: ''
    },
    parentCategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        default: null
    },
    level: {
        type: Number,
        default: 0
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, { 
    timestamps: true 
});

// FIXED: Safe pre-save hook
categorySchema.pre('save', function(next) {
    console.log('🔄 Category pre-save hook running');
    
    // Calculate level
    this.level = this.parentCategory ? 1 : 0;
    
    // Safely call next
    if (next && typeof next === 'function') {
        return next();
    }
});

module.exports = mongoose.model('Category', categorySchema);