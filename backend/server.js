const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('mongo-sanitize');

// Load .env from parent dir (local) or current dir (production)
const parentEnv = path.join(__dirname, '..', '.env');
const localEnv = path.join(__dirname, '.env');
require('dotenv').config({ path: fs.existsSync(parentEnv) ? parentEnv : localEnv });

const connectDB = require('./config/db');

// Import routes
const authRoutes = require('./routes/authRoutes');
const heroRoutes = require('./routes/heroRoutes');
const aboutRoutes = require('./routes/aboutRoutes');
const skillRoutes = require('./routes/skillRoutes');
const projectRoutes = require('./routes/projectRoutes');
const publicationRoutes = require('./routes/publicationRoutes');
const experienceRoutes = require('./routes/experienceRoutes');
const blogRoutes = require('./routes/blogRoutes');
const certificationRoutes = require('./routes/certificationRoutes');
const contactRoutes = require('./routes/contactRoutes');
const settingsRoutes = require('./routes/settingsRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const galleryRoutes = require('./routes/galleryRoutes');

const app = express();

// Trust Vercel's proxy headers for accurate client IP mapping in rate limiters
app.set('trust proxy', 1);

// Connect to MongoDB
connectDB();

// Middleware - CORS: allow all origins for development
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: false
}));

// Body parsers (MUST run before sanitization and routes)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 1. Secure HTTP Headers with Helmet
app.use(helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: false, // Allow loading resources (like uploads) from different port/origin
}));

// 2. Prevent MongoDB Operator Injection (NoSQL Injection) - now correctly runs after body parsers
app.use((req, res, next) => {
    req.body = mongoSanitize(req.body);
    req.query = mongoSanitize(req.query);
    req.params = mongoSanitize(req.params);
    next();
});

// 3. API Rate Limiting
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 500, // Limit each IP to 500 requests per 15 mins
    message: { message: 'Too many requests from this IP, please try again after 15 minutes.' },
    standardHeaders: true,
    legacyHeaders: false,
});
app.use('/api', apiLimiter);

// Strict Rate Limiting for Login Endpoint (prevents brute-force)
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 15,
    message: { message: 'Too many login attempts, please try again after 15 minutes.' }
});
app.use('/api/auth/login', loginLimiter);

// Strict Rate Limiting for public message form submission (prevents spamming database)
const messageLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: { message: 'Too many messages sent, please try again after 15 minutes.' }
});
app.use('/api/contact/message', messageLimiter);

// Static files (uploads) — override CORP header so frontend on different port can load images
app.use('/uploads', (req, res, next) => {
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    next();
}, express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/hero', heroRoutes);
app.use('/api/about', aboutRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/publications', publicationRoutes);
app.use('/api/experience', experienceRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/certifications', certificationRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/gallery', galleryRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: err.message || 'Something went wrong' });
});

const PORT = process.env.PORT || 5000;
if (require.main === module) {
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`Server running on http://0.0.0.0:${PORT}`);
        console.log(`Local access:   http://localhost:${PORT}`);
        console.log(`Network access: http://192.168.0.173:${PORT}`);
    });
}

module.exports = app;
