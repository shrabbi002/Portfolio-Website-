const express = require('express');
const router = express.Router();
const Hero = require('../models/Hero');
const { protect } = require('../middleware/auth');

// @route   GET /api/hero
router.get('/', async (req, res) => {
    try {
        let hero = await Hero.findOne();
        if (!hero) hero = await Hero.create({});
        res.json(hero);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   PUT /api/hero
router.put('/', protect, async (req, res) => {
    try {
        let hero = await Hero.findOne();
        if (!hero) hero = new Hero();
        Object.assign(hero, req.body);
        await hero.save();
        res.json(hero);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
