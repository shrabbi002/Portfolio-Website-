const mongoose = require('mongoose');

const blogPostSchema = new mongoose.Schema({
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    content: { type: String, default: '' },
    excerpt: { type: String, default: '' },
    category: { type: String, default: 'General' },
    tags: [{ type: String }],
    featuredImage: { type: String, default: '' },
    isPublished: { type: Boolean, default: false },
    publishedAt: { type: Date },
    author: { type: String, default: 'Admin' }
}, { timestamps: true });

blogPostSchema.pre('save', function () {
    if (this.isModified('title') && !this.slug) {
        this.slug = this.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    }
});

module.exports = mongoose.model('BlogPost', blogPostSchema);
