const mongoose = require('mongoose');

const galleryItemSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, default: '' },
    mediaType: { type: String, enum: ['image', 'video'], required: true },
    mediaUrl: { type: String, required: true },
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('GalleryItem', galleryItemSchema);
