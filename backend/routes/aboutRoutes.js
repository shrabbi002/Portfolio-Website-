const express = require('express');
const router = express.Router();
const About = require('../models/About');
const { protect } = require('../middleware/auth');

router.get('/', async (req, res) => {
    try {
        let about = await About.findOne();
        if (!about) about = await About.create({});
        res.json(about);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.put('/', protect, async (req, res) => {
    try {
        let about = await About.findOne();
        if (!about) about = new About();
        Object.assign(about, req.body);
        await about.save();
        res.json(about);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
