const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:"],
            connectSrc: ["'self'"]
        }
    }
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// CORS configuration
const corsOptions = {
    origin: process.env.NODE_ENV === 'production' 
        ? process.env.ALLOWED_ORIGINS.split(',') 
        : ['http://localhost:5500', 'http://127.0.0.1:5500'],
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Body parsing middleware
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Data file path
const DATA_DIR = path.join(__dirname, 'data');
const SUBMISSIONS_FILE = path.join(DATA_DIR, 'submissions.json');

// Ensure data directory exists
async function ensureDataDirectory() {
    try {
        await fs.mkdir(DATA_DIR, { recursive: true });
        
        // Initialize submissions file if it doesn't exist
        try {
            await fs.access(SUBMISSIONS_FILE);
        } catch {
            await fs.writeFile(SUBMISSIONS_FILE, JSON.stringify([], null, 2));
        }
    } catch (error) {
        console.error('Error setting up data directory:', error);
    }
}

// Load submissions
async function loadSubmissions() {
    try {
        const data = await fs.readFile(SUBMISSIONS_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error loading submissions:', error);
        return [];
    }
}

// Save submissions
async function saveSubmissions(submissions) {
    try {
        await fs.writeFile(SUBMISSIONS_FILE, JSON.stringify(submissions, null, 2));
        return true;
    } catch (error) {
        console.error('Error saving submissions:', error);
        return false;
    }
}

// Validation functions
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePhone(phone) {
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
    return phoneRegex.test(phone);
}

function sanitizeInput(input) {
    if (typeof input !== 'string') return input;
    
    // Remove potentially dangerous characters
    return input
        .replace(/[<>]/g, '') // Remove < and >
        .replace(/javascript:/gi, '') // Remove javascript: protocol
        .trim()
        .substring(0, 1000); // Limit length
}

// API Routes
app.post('/api/contact', async (req, res) => {
    try {
        const { name, email, company, phone, message, inquiryType } = req.body;
        
        // Validation
        if (!name || !email || !message) {
            return res.status(400).json({
                success: false,
                message: 'Name, email, and message are required'
            });
        }
        
        if (!validateEmail(email)) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a valid email address'
            });
        }
        
        if (phone && !validatePhone(phone)) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a valid phone number'
            });
        }
        
        // Sanitize inputs
        const sanitizedData = {
            name: sanitizeInput(name),
            email: sanitizeInput(email),
            company: sanitizeInput(company || ''),
            phone: sanitizeInput(phone || ''),
            message: sanitizeInput(message),
            inquiryType: sanitizeInput(inquiryType || 'general'),
            timestamp: new Date().toISOString(),
            ip: req.ip
        };
        
        // Load existing submissions
        const submissions = await loadSubmissions();
        
        // Add new submission
        submissions.push(sanitizedData);
        
        // Save to file
        const saved = await saveSubmissions(submissions);
        
        if (!saved) {
            throw new Error('Failed to save submission');
        }
        
        // In production, you would send an email here
        console.log('New contact form submission:', sanitizedData);
        
        res.status(201).json({
            success: true,
            message: 'Thank you for your message. We will contact you shortly.',
            data: {
                id: submissions.length,
                timestamp: sanitizedData.timestamp
            }
        });
        
    } catch (error) {
        console.error('Contact form error:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while processing your request. Please try again later.'
        });
    }
});

// Admin endpoint to view submissions (protected in production)
app.get('/api/submissions', async (req, res) => {
    if (process.env.NODE_ENV === 'production') {
        // Add authentication here
        const authToken = req.headers['x-admin-token'];
        if (!authToken || authToken !== process.env.ADMIN_TOKEN) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized'
            });
        }
    }
    
    try {
        const submissions = await loadSubmissions();
        res.json({
            success: true,
            count: submissions.length,
            data: submissions
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to load submissions'
        });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
    const frontendPath = path.join(__dirname, '../frontend');
    app.use(express.static(frontendPath));
    
    // Handle SPA routing
    app.get('*', (req, res) => {
        res.sendFile(path.join(frontendPath, 'index.html'));
    });
}

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Something went wrong!'
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Endpoint not found'
    });
});

// Start server
async function startServer() {
    await ensureDataDirectory();
    
    app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
        console.log(`📁 Environment: ${process.env.NODE_ENV || 'development'}`);
        console.log(`🔗 API Endpoint: http://localhost:${PORT}/api/contact`);
    });
}

startServer().catch(console.error);

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received. Shutting down gracefully...');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('SIGINT received. Shutting down gracefully...');
    process.exit(0);
});