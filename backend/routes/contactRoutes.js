const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const Message = require('../models/Message');
const { protect } = require('../middleware/auth');

// Get contact info (public)
router.get('/', async (req, res) => {
    try {
        let contact = await Contact.findOne();
        if (!contact) contact = await Contact.create({});
        res.json(contact);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update contact info (admin)
router.put('/', protect, async (req, res) => {
    try {
        let contact = await Contact.findOne();
        if (!contact) contact = new Contact();
        Object.assign(contact, req.body);
        await contact.save();
        res.json(contact);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Submit contact form (public)
router.post('/message', async (req, res) => {
    try {
        const message = await Message.create(req.body);
        res.status(201).json({ message: 'Message sent successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get all messages (admin)
router.get('/messages', protect, async (req, res) => {
    try {
        const messages = await Message.find().sort('-createdAt');
        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Mark message as read (admin)
router.put('/messages/:id', protect, async (req, res) => {
    try {
        const msg = await Message.findByIdAndUpdate(req.params.id, { isRead: true }, { new: true });
        res.json(msg);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete message (admin)
router.delete('/messages/:id', protect, async (req, res) => {
    try {
        await Message.findByIdAndDelete(req.params.id);
        res.json({ message: 'Message deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
