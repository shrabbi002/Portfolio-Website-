const mongoose = require('mongoose');

const aboutSchema = new mongoose.Schema({
    biography: { type: String, default: '' },
    careerJourney: { type: String, default: '' },
    education: [
        {
            degree: { type: String, default: '' },
            institution: { type: String, default: '' },
            duration: { type: String, default: '' }
        }
    ],
    expertise: [{ type: String }],
    goals: { type: String, default: '' },
    philosophy: { type: String, default: '' },
    image: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('About', aboutSchema);
