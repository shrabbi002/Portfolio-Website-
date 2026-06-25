const mongoose = require('mongoose');

const publicationSchema = new mongoose.Schema({
    title: { type: String, required: true },
    journal: { type: String, default: '' },
    year: { type: Number },
    doi: { type: String, default: '' },
    abstract: { type: String, default: '' },
    type: { type: String, enum: ['journal', 'conference', 'ongoing'], default: 'journal' },
    authors: { type: String, default: '' },
    url: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Publication', publicationSchema);
