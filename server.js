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
// Ensure the fallback string also has a unique database name like /harley_db
const mongoURI = process.env.MONGODB_URI || "mongodb+srv://menangjekings_db_user:Rf9pY5gaWEioigIw@harleycluster.gbybrib.mongodb.net/HarleyRetail?retryWrites=true&w=majority";

mongoose.connect(mongoURI)
  .then(() => console.log('✅ MongoDB Atlas connected successfully'))
  .catch(err => console.error('❌ MongoDB connection error:', err.message));

// Login Route (No authentication required)
app.post('/api/auth/login', (req, res) => {
    const { username, password } = req.body;
    
    // Using your specific credentials
    if (username === 'admin' && password === 'admin123') {
        res.json({ 
            success: true, 
            token: 'SECRET_RETAIL_KEY_2024',
            user: {
                username: 'admin',
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

        // Simple product data
        
// Add before your routes
app.use((req, res, next) => {
    console.log(`🔄 ${req.method} ${req.originalUrl}`);
    next();
});   

// Protected Routes (Require authentication)
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const brandRoutes = require('./routes/brandRoutes');
const countryRoutes = require('./routes/countryRoutes');

app.use('/api/products',productRoutes);
app.use('/api/categories',  categoryRoutes);
app.use('/api/brands',  brandRoutes);
app.use('/api/countries',  countryRoutes);

// Health Check Route (No authentication required)
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'Motorcycle Parts API is running',
        timestamp: new Date().toISOString()
    });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🏍️ Motorcycle Parts API running on port ${PORT}`);
  console.log(`📁 Database: ${mongoose.connection.name}`);
  console.log(`🔐 Login endpoint: POST http://localhost:${PORT}/api/auth/login`);
  console.log(`👤 Default credentials: admin / admin123`);
});