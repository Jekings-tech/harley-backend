const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

console.log('🔄 Loading Cloudinary upload middleware...');

// Configure Cloudinary with YOUR credentials
cloudinary.config({
    cloud_name: 'dst1a1v4w',
    api_key: '458514996832939',
    api_secret: 'hgEDJ2j2lxoroyzv45_ycf5lpZo'
});

console.log('✅ Cloudinary configured for: dst1a1v4w');

// Create Cloudinary storage
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        console.log(`📤 Uploading file: ${file.originalname}, ${file.mimetype}`);
        
        // Determine folder based on request type
        let folder = 'motorcycle_parts';
        if (req.baseUrl.includes('/products')) {
            folder = 'motorcycle_parts/products';
        } else if (req.baseUrl.includes('/brands')) {
            folder = 'motorcycle_parts/brands';
        } else if (req.baseUrl.includes('/countries')) {
            folder = 'motorcycle_parts/flags';
        }
        
        return {
            folder: folder,
            allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
            transformation: [{ width: 1200, height: 1200, crop: 'limit' }],
            resource_type: 'auto',
            public_id: `${Date.now()}_${file.originalname.replace(/\.[^/.]+$/, "")}`
        };
    }
});

// Create multer instance
const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB - larger for motorcycle parts
        files: 12 // Max 12 images per product
    },
    fileFilter: (req, file, cb) => {
        // Accept only images
        const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        
        if (allowedMimes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error(`Invalid file type. Only ${allowedMimes.join(', ')} are allowed.`));
        }
    }
});

// Add error handling
upload.handleErrors = (err, req, res, next) => {
    if (err) {
        console.error('❌ Upload middleware error:', err.message);
        
        if (err instanceof multer.MulterError) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({
                    success: false,
                    message: 'File too large. Maximum size is 10MB.'
                });
            }
            if (err.code === 'LIMIT_FILE_COUNT') {
                return res.status(400).json({
                    success: false,
                    message: 'Too many files. Maximum is 12 images.'
                });
            }
        }
        
        return res.status(400).json({
            success: false,
            message: `Upload error: ${err.message}`
        });
    }
    next();
};

console.log('✅ Upload middleware ready');
module.exports = upload;