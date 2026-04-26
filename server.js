const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Authentication middleware
const authenticate = (req, res, next) => {
    const token = req.headers['authorization'];
    // Your client will send this token in headers: Authorization: 'SECRET_RETAIL_KEY_2024'
    if (token === 'SECRET_RETAIL_KEY_2024') {
        next();
    } else {
        res.status(401).json({ 
            success: false, 
            message: 'Unauthorized. Please login.' 
        });
    }
};

// Database Connection
const mongoURI = process.env.MONGODB_URI || "mongodb+srv://menangjekings_db_user:Rf9pY5gaWEioigIw@harleycluster.gbybrib.mongodb.net/HarleyRetail?retryWrites=true&w=majority";

mongoose.connect(mongoURI)
  .then(() => console.log('✅ MongoDB Atlas connected successfully'))
  .catch(err => console.error('❌ MongoDB connection error:', err.message));

// Login Route (No authentication required) - UPDATED WITH YOUR CREDENTIALS
app.post('/api/auth/login', (req, res) => {
    const { username, password } = req.body;
    
    // Using YOUR specific credentials
    if (username === 'Tanyi jovial' && password === 'Homeboy19940') {
        res.json({ 
            success: true, 
            token: 'SECRET_RETAIL_KEY_2024',
            user: {
                username: 'Tanyi jovial',
                role: 'admin'
            }
        });
    } else {
        res.status(401).json({ 
            success: false, 
            message: 'Invalid credentials' 
        });
    }
});

// Add logging middleware before your routes
app.use((req, res, next) => {
    console.log(`🔄 ${req.method} ${req.originalUrl}`);
    next();
});   

// Protected Routes (Require authentication)
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const brandRoutes = require('./routes/brandRoutes');

app.use('/api/products', authenticate, productRoutes);
app.use('/api/categories', authenticate, categoryRoutes);
app.use('/api/brands', authenticate, brandRoutes);

// Health Check Route (No authentication required)
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'Motorcycle Parts API is running',
        timestamp: new Date().toISOString()
    });
});

// Serve static files for admin dashboard (if you have HTML files)
app.use(express.static(path.join(__dirname, 'public')));

// Protected dashboard route
app.get('/dashboard', authenticate, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

// Error handling middleware
app.use((error, req, res, next) => {
    console.error('🔥 Express Error Handler:', error);
    
    res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
    });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🏍️ Motorcycle Parts API running on port ${PORT}`);
  console.log(`📁 Database: ${mongoose.connection.name}`);
  console.log(`🔐 Login endpoint: POST http://localhost:${PORT}/api/auth/login`);
  console.log(`👤 Default credentials: Tanyi jovial / Homeboy19940`);
  console.log(`🛡️ Protected endpoints require token: SECRET_RETAIL_KEY_2024`);
});