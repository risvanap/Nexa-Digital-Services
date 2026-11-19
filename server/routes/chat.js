const express = require('express');
const router = express.Router();
const { generateChatResponse, detectLanguage } = require('../services/ai-engine');

// POST /api/chat
router.post('/', async (req, res) => {
  try {
    const { message, history, language } = req.body;

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({ error: 'Message text is required.' });
    }

    if (message.length > 2000) {
      return res.status(400).json({ error: 'Message exceeds maximum allowable length (2000 characters).' });
    }

    // Input sanitization against basic prompt injection
    const cleanMessage = message.trim();

    const response = await generateChatResponse({
      message: cleanMessage,
      history: Array.isArray(history) ? history : [],
      language: language || null
    });

    return res.json({
      success: true,
      data: response
    });
  } catch (error) {
    console.error('Chat endpoint error:', error);
    return res.status(500).json({
      success: false,
      error: 'An internal error occurred while processing your request. Please try again or contact WhatsApp support.'
    });
  }
});

module.exports = router;
