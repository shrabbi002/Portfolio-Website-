const mongoose = require('mongoose');

const heroSchema = new mongoose.Schema({
    headline: { type: String, default: 'Build Your Awesome Platform' },
    subtitle: { type: String, default: 'Software QA Engineer | System Analyst | Data Analyst | Researcher' },
    introduction: { type: String, default: '' },
    profileImage: { type: String, default: '' },
    highlights: [{
        number: { type: String },
        label: { type: String }
    }],
    ctaButtons: [{
        text: { type: String },
        link: { type: String },
        type: { type: String, enum: ['primary', 'secondary', 'outline'], default: 'primary' }
    }],
    cvFile: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Hero', heroSchema);
