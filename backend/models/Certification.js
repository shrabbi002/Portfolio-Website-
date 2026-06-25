const mongoose = require('mongoose');

const certificationSchema = new mongoose.Schema({
    title: { type: String, required: true },
    organization: { type: String, default: '' },
    year: { type: Number },
    certificateUrl: { type: String, default: '' },
    certificateImage: { type: String, default: '' },
    type: { type: String, enum: ['certification', 'award', 'competition'], default: 'certification' },
    order: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Certification', certificationSchema);
