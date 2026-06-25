const path = require('path');
const fs = require('fs');

const parentEnv = path.join(__dirname, '..', '.env');
const localEnv = path.join(__dirname, '.env');
require('dotenv').config({ path: fs.existsSync(parentEnv) ? parentEnv : localEnv });

const mongoose = require('mongoose');
const About = require('./models/About');
const Hero = require('./models/Hero');

const inspect = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const about = await About.findOne();
        const hero = await Hero.findOne();
        
        console.log('=== HERO PIC ===');
        console.log('profileImage:', hero ? hero.profileImage : 'No hero found');
        
        console.log('=== ABOUT PIC ===');
        console.log('image:', about ? about.image : 'No about found');
        
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

inspect();
