const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, default: '' },
    technologies: [{ type: String }],
    role: { type: String, default: '' },
    screenshots: [{ type: String }],
    githubUrl: { type: String, default: '' },
    demoUrl: { type: String, default: '' },
    category: { type: String, enum: ['AI', 'Web Development', 'Research', 'Enterprise Systems', 'Other'], default: 'Other' },
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);
