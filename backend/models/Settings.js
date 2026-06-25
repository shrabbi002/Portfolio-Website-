const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
    siteTitle: { type: String, default: 'My Portfolio' },
    siteDescription: { type: String, default: '' },
    favicon: { type: String, default: '' },
    logo: { type: String, default: '' },
    socialLinks: {
        linkedin: { type: String, default: '' },
        github: { type: String, default: '' },
        twitter: { type: String, default: '' },
        scholar: { type: String, default: '' }
    },
    metaDescription: { type: String, default: '' },
    footerText: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Settings', settingsSchema);
