const express = require('express');
const router = express.Router();
const { getAllFaqs } = require('../services/knowledge-base');

// GET /api/faqs - List FAQs
router.get('/', (req, res) => {
  try {
    const faqs = getAllFaqs();
    return res.json({ success: true, count: faqs.length, data: faqs });
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Failed to fetch FAQs.' });
  }
});

// POST /api/faqs - Admin add FAQ
router.post('/', (req, res) => {
  try {
    const { question_en, question_ml, answer_en, answer_ml, service_id } = req.body;
    if (!question_en || !answer_en) {
      return res.status(400).json({ success: false, error: 'Question and answer in English are required.' });
    }

    const faqs = getAllFaqs();
    const newFaq = {
      id: `faq-${Date.now()}`,
      service_id: service_id || 'general',
      question_en,
      question_ml: question_ml || question_en,
      answer_en,
      answer_ml: answer_ml || answer_en
    };
    faqs.push(newFaq);

    return res.status(201).json({ success: true, message: 'FAQ created successfully.', data: newFaq });
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Failed to create FAQ.' });
  }
});

// PUT /api/faqs/:id - Admin update FAQ
router.put('/:id', (req, res) => {
  try {
    const faqs = getAllFaqs();
    const item = faqs.find(f => f.id === req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, error: 'FAQ not found.' });
    }

    Object.assign(item, req.body);
    return res.json({ success: true, message: 'FAQ updated successfully.', data: item });
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Failed to update FAQ.' });
  }
});

// DELETE /api/faqs/:id - Admin delete FAQ
router.delete('/:id', (req, res) => {
  try {
    const faqs = getAllFaqs();
    const idx = faqs.findIndex(f => f.id === req.params.id);
    if (idx === -1) {
      return res.status(404).json({ success: false, error: 'FAQ not found.' });
    }

    faqs.splice(idx, 1);
    return res.json({ success: true, message: 'FAQ deleted successfully.' });
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Failed to delete FAQ.' });
  }
});

module.exports = router;
