const express = require('express');
const router = express.Router();
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');
const { protect } = require('../middleware/auth');

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'portfolio_uploads',
        // Cloudinary auto-detects resource_type 'auto' to allow images and videos
        resource_type: 'auto',
        allowed_formats: ['jpeg', 'jpg', 'png', 'gif', 'webp', 'svg', 'mp4', 'webm', 'ogg', 'mov', 'mkv']
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit
});

// Upload single file
router.post('/', protect, upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }
    // req.file.path contains the Cloudinary URL
    res.json({ url: req.file.path, filename: req.file.filename });
});

// Upload multiple files
router.post('/multiple', protect, upload.array('files', 10), (req, res) => {
    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: 'No files uploaded' });
    }
    const files = req.files.map(f => ({
        url: f.path,
        filename: f.filename
    }));
    res.json(files);
});

// Delete file
router.delete('/:filename', protect, async (req, res) => {
    try {
        // filename here is actually the Cloudinary public_id (if passed correctly from the frontend)
        // Since the frontend currently might pass the full URL or something else, 
        // we can try to extract the public_id from the URL if needed.
        // For now, if req.params.filename is the public_id:
        const publicId = req.params.filename; 
        
        // Let's handle the extraction if they pass the filename with extension
        // e.g. "portfolio_uploads/abc12345"
        // If it includes extension, remove it:
        const idWithoutExt = publicId.split('.').slice(0, -1).join('.') || publicId;
        
        await cloudinary.uploader.destroy(idWithoutExt);
        res.json({ message: 'File deleted from Cloudinary' });
    } catch (err) {
        console.error('Delete error:', err);
        res.status(500).json({ message: 'Error deleting file' });
    }
});

module.exports = router;
