const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    email: { type: String, default: '' },
    phone: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    github: { type: String, default: '' },
    scholar: { type: String, default: '' },
    cvFile: { type: String, default: '' },
    location: { type: String, default: '' },
    additionalLinks: [{
        label: { type: String },
        url: { type: String }
    }]
}, { timestamps: true });

module.exports = mongoose.model('Contact', contactSchema);
