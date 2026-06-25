const mongoose = require('mongoose');

const experienceSchema = new mongoose.Schema({
    organization: { type: String, required: true },
    role: { type: String, required: true },
    startDate: { type: String, required: true },
    endDate: { type: String, default: 'Present' },
    responsibilities: [{ type: String }],
    achievements: [{ type: String }],
    order: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Experience', experienceSchema);
