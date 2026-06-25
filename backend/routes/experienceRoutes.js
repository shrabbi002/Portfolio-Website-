const express = require('express');
const router = express.Router();
const Experience = require('../models/Experience');
const { protect } = require('../middleware/auth');

router.get('/', async (req, res) => {
    try {
        const experiences = await Experience.find().sort('order');
        res.json(experiences);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/', protect, async (req, res) => {
    try {
        const experience = await Experience.create(req.body);
        res.status(201).json(experience);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.put('/:id', protect, async (req, res) => {
    try {
        const exp = await Experience.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!exp) return res.status(404).json({ message: 'Experience not found' });
        res.json(exp);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.delete('/:id', protect, async (req, res) => {
    try {
        const exp = await Experience.findByIdAndDelete(req.params.id);
        if (!exp) return res.status(404).json({ message: 'Experience not found' });
        res.json({ message: 'Experience deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
