const express = require('express');
const router = express.Router();
const Publication = require('../models/Publication');
const { protect } = require('../middleware/auth');

router.get('/', async (req, res) => {
    try {
        const { type } = req.query;
        const filter = type ? { type } : {};
        const publications = await Publication.find(filter).sort('-year');
        res.json(publications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/', protect, async (req, res) => {
    try {
        const publication = await Publication.create(req.body);
        res.status(201).json(publication);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.put('/:id', protect, async (req, res) => {
    try {
        const pub = await Publication.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!pub) return res.status(404).json({ message: 'Publication not found' });
        res.json(pub);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.delete('/:id', protect, async (req, res) => {
    try {
        const pub = await Publication.findByIdAndDelete(req.params.id);
        if (!pub) return res.status(404).json({ message: 'Publication not found' });
        res.json({ message: 'Publication deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
