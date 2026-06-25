const express = require('express');
const router = express.Router();
const GalleryItem = require('../models/GalleryItem');
const { protect } = require('../middleware/auth');

// Get all gallery items
router.get('/', async (req, res) => {
    try {
        const items = await GalleryItem.find().sort({ order: 1, createdAt: -1 });
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create gallery item
router.post('/', protect, async (req, res) => {
    try {
        const item = await GalleryItem.create(req.body);
        res.status(201).json(item);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update gallery item
router.put('/:id', protect, async (req, res) => {
    try {
        const item = await GalleryItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!item) return res.status(404).json({ message: 'Gallery item not found' });
        res.json(item);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete gallery item
router.delete('/:id', protect, async (req, res) => {
    try {
        const item = await GalleryItem.findByIdAndDelete(req.params.id);
        if (!item) return res.status(404).json({ message: 'Gallery item not found' });
        res.json({ message: 'Gallery item deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
