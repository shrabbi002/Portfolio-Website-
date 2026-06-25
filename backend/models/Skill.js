const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
    category: { type: String, required: true },
    icon: { type: String, default: '' },
    skills: [{
        name: { type: String, required: true },
        proficiency: { type: Number, min: 0, max: 100, default: 80 }
    }],
    order: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Skill', skillSchema);
