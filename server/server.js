require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const rateLimit = require('express-rate-limit');

const chatRouter = require('./routes/chat');
const enquiriesRouter = require('./routes/enquiries');
const servicesRouter = require('./routes/services');
const faqsRouter = require('./routes/faqs');
const statsRouter = require('./routes/stats');

const app = express();
const PORT = process.env.PORT || 3000;
const ROOT_DIR = path.resolve(__dirname, '..');

// Middleware
app.use(cors());
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));

// Rate limiters for security
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests from this IP, please try again later.' }
});

const chatLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 40,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many chat messages. Please wait a moment before sending another message.' }
});

// API Routes
app.use('/api', apiLimiter);
app.use('/api', statsRouter);
app.use('/api/chat', chatLimiter, chatRouter);
app.use('/api/enquiries', enquiriesRouter);
app.use('/api/services', servicesRouter);
app.use('/api/faqs', faqsRouter);

// Serve static assets from website root directory
app.use(express.static(ROOT_DIR, {
  extensions: ['html', 'htm']
}));

// Fallback for html pages
app.use((req, res, next) => {
  if (req.method !== 'GET' || req.path.startsWith('/api')) {
    return next();
  }
  const filePath = path.join(ROOT_DIR, req.path);
  res.sendFile(filePath, (err) => {
    if (err) {
      res.sendFile(path.join(ROOT_DIR, 'index.html'));
    }
  });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`🚀 NEXA DIGITAL SERVICES - Production Server`);
    console.log(`🌐 Website URL: http://localhost:${PORT}`);
    console.log(`💬 Chat API:    http://localhost:${PORT}/api/chat`);
    console.log(`🩺 Health API:  http://localhost:${PORT}/api/health`);
    console.log(`📱 WhatsApp:    +91 8086380373`);
    console.log(`====================================================`);
  });
}

module.exports = app;
