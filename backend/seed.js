const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('./models/User');
const Hero = require('./models/Hero');
const About = require('./models/About');
const Skill = require('./models/Skill');
const Project = require('./models/Project');
const Publication = require('./models/Publication');
const Experience = require('./models/Experience');
const BlogPost = require('./models/BlogPost');
const Certification = require('./models/Certification');
const Contact = require('./models/Contact');
const Settings = require('./models/Settings');

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Create admin user
        const existingUser = await User.findOne({ username: process.env.ADMIN_USERNAME || 'admin' });
        if (!existingUser) {
            await User.create({
                username: process.env.ADMIN_USERNAME || 'admin',
                password: process.env.ADMIN_PASSWORD || 'admin123'
            });
            console.log('Admin user created');
        }

        // Seed Hero
        const existingHero = await Hero.findOne();
        if (!existingHero) {
            await Hero.create({
                headline: 'Build Your Awesome Platform',
                subtitle: 'Software QA Engineer | System Analyst | Data Analyst | Researcher',
                introduction: 'A digital studio that offers several services such as UI/UX Design to developers, we will provide the best service for those of you who use our services.',
                highlights: [
                    { number: '50+', label: 'Projects Completed' },
                    { number: '10+', label: 'Publications' },
                    { number: '15+', label: 'Certifications' },
                    { number: '5+', label: 'Years Experience' }
                ],
                ctaButtons: [
                    { text: 'Download CV', link: '#', type: 'primary' },
                    { text: 'View Projects', link: '/projects', type: 'secondary' },
                    { text: 'Contact Me', link: '/contact', type: 'outline' }
                ]
            });
            console.log('Hero data seeded');
        }

        // Seed About
        const existingAbout = await About.findOne();
        if (!existingAbout) {
            await About.create({
                biography: 'A passionate professional with expertise spanning software development, quality assurance, business analysis, and AI/ML research.',
                careerJourney: 'With years of experience in building and testing enterprise software, I bring a unique perspective to every project combining technical depth with analytical thinking.',
                education: 'Computer Science graduate with research focus in Artificial Intelligence and Machine Learning.',
                expertise: ['Software Development', 'Quality Assurance', 'Business Analysis', 'AI/ML Research', 'Data Science'],
                goals: 'To leverage technology and research to create impactful solutions that drive innovation.',
                philosophy: 'I believe in continuous learning, attention to detail, and delivering excellence in every endeavor.'
            });
            console.log('About data seeded');
        }

        // Seed Skills
        const existingSkills = await Skill.find();
        if (existingSkills.length === 0) {
            await Skill.insertMany([
                {
                    category: 'Software Development', icon: '💻', order: 1,
                    skills: [
                        { name: 'Java', proficiency: 85 },
                        { name: 'Python', proficiency: 90 },
                        { name: 'JavaScript', proficiency: 88 },
                        { name: 'MERN Stack', proficiency: 80 }
                    ]
                },
                {
                    category: 'Software Testing', icon: '🧪', order: 2,
                    skills: [
                        { name: 'Manual Testing', proficiency: 95 },
                        { name: 'Selenium WebDriver', proficiency: 90 },
                        { name: 'TestNG', proficiency: 85 },
                        { name: 'JUnit', proficiency: 82 }
                    ]
                },
                {
                    category: 'Business Analysis', icon: '📊', order: 3,
                    skills: [
                        { name: 'Requirement Gathering', proficiency: 92 },
                        { name: 'BRD / SRS Documentation', proficiency: 88 },
                        { name: 'Process Modeling', proficiency: 85 },
                        { name: 'Stakeholder Management', proficiency: 87 }
                    ]
                },
                {
                    category: 'Data Science / AI', icon: '🤖', order: 4,
                    skills: [
                        { name: 'Machine Learning', proficiency: 85 },
                        { name: 'Data Analysis', proficiency: 88 },
                        { name: 'Feature Engineering', proficiency: 82 },
                        { name: 'Python (DS)', proficiency: 90 }
                    ]
                },
                {
                    category: 'Tools & Platforms', icon: '🔧', order: 5,
                    skills: [
                        { name: 'Git / GitHub', proficiency: 92 },
                        { name: 'Jira', proficiency: 88 },
                        { name: 'Postman', proficiency: 90 },
                        { name: 'Jenkins', proficiency: 78 }
                    ]
                }
            ]);
            console.log('Skills data seeded');
        }

        // Seed sample projects
        const existingProjects = await Project.find();
        if (existingProjects.length === 0) {
            await Project.insertMany([
                {
                    name: 'AI-Powered Sentiment Analyzer',
                    description: 'Machine learning model for real-time sentiment analysis of social media data using NLP techniques.',
                    technologies: ['Python', 'TensorFlow', 'NLTK', 'Flask'],
                    role: 'Lead Developer & Researcher',
                    category: 'AI',
                    featured: true
                },
                {
                    name: 'Enterprise Resource Management',
                    description: 'Full-stack enterprise application for managing organizational resources, workflows, and reporting.',
                    technologies: ['Java', 'Spring Boot', 'React', 'PostgreSQL'],
                    role: 'Full Stack Developer',
                    category: 'Enterprise Systems',
                    featured: true
                },
                {
                    name: 'E-Commerce Platform',
                    description: 'Modern e-commerce solution with real-time inventory, payment integration, and analytics dashboard.',
                    technologies: ['Node.js', 'React', 'MongoDB', 'Stripe'],
                    role: 'Full Stack Developer',
                    category: 'Web Development',
                    featured: true
                }
            ]);
            console.log('Projects data seeded');
        }

        // Seed Settings
        const existingSettings = await Settings.findOne();
        if (!existingSettings) {
            await Settings.create({
                siteTitle: 'My Portfolio',
                siteDescription: 'Professional Portfolio - Business Analyst | QA Engineer | AI/ML Researcher',
                metaDescription: 'Portfolio showcasing projects, research, and expertise in software development, QA, business analysis, and AI/ML.',
                footerText: '© 2026 All rights reserved.'
            });
            console.log('Settings data seeded');
        }

        // Seed Contact
        const existingContact = await Contact.findOne();
        if (!existingContact) {
            await Contact.create({
                email: 'your.email@example.com',
                linkedin: 'https://linkedin.com/in/yourprofile',
                github: 'https://github.com/yourprofile',
                scholar: 'https://scholar.google.com/citations?user=yourprofile',
                location: 'Your City, Country'
            });
            console.log('Contact data seeded');
        }

        console.log('\\nDatabase seeding complete!');
        process.exit(0);
    } catch (error) {
        console.error('Seeding error:', error);
        process.exit(1);
    }
};

seedDB();
