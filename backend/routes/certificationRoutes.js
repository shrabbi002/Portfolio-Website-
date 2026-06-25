const express = require('express');
const router = express.Router();
const Certification = require('../models/Certification');
const { protect } = require('../middleware/auth');

router.get('/', async (req, res) => {
    try {
        const { type } = req.query;
        const filter = type ? { type } : {};
        const certs = await Certification.find(filter).sort('order');
        res.json(certs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/', protect, async (req, res) => {
    try {
        const cert = await Certification.create(req.body);
        res.status(201).json(cert);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.put('/:id', protect, async (req, res) => {
    try {
        const cert = await Certification.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!cert) return res.status(404).json({ message: 'Certification not found' });
        res.json(cert);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.delete('/:id', protect, async (req, res) => {
    try {
        const cert = await Certification.findByIdAndDelete(req.params.id);
        if (!cert) return res.status(404).json({ message: 'Certification not found' });
        res.json({ message: 'Certification deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
