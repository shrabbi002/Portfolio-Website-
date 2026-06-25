const cloudinary = require('cloudinary').v2;
const path = require('path');
const fs = require('fs');

// Load .env locally if not already loaded (useful for serverless or isolated tests)
const parentEnv = path.join(__dirname, '..', '..', '.env');
const localEnv = path.join(__dirname, '..', '.env');
require('dotenv').config({ path: fs.existsSync(parentEnv) ? parentEnv : localEnv });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

module.exports = cloudinary;
