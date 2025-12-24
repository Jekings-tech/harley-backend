const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Category name is required'],
        unique: true,
        trim: true
    }
}, { 
    timestamps: true 
});

// THE SLUG CODE WAS REMOVED FROM HERE TO STOP THE CRASH

module.exports = mongoose.model('Category', categorySchema);