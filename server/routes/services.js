const express = require('express');
const router = express.Router();
const { getAllServices, getServiceById, getServicesByCategory, searchServices, getAllCategories } = require('../services/knowledge-base');

// GET /api/services - List all services or filter by category/search
router.get('/', (req, res) => {
  try {
    const { category, search } = req.query;

    if (search) {
      const results = searchServices(search);
      return res.json({ success: true, count: results.length, data: results });
    }

    if (category && category !== 'all') {
      const filtered = getServicesByCategory(category);
      return res.json({ success: true, count: filtered.length, data: filtered });
    }

    const all = getAllServices();
    const categories = getAllCategories();

    return res.json({
      success: true,
      count: all.length,
      categories,
      data: all
    });
  } catch (error) {
    console.error('Fetch services error:', error);
    return res.status(500).json({ success: false, error: 'Failed to fetch services.' });
  }
});

// GET /api/services/categories - List master categories
router.get('/categories', (req, res) => {
  try {
    const categories = getAllCategories();
    return res.json({ success: true, data: categories });
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Failed to fetch categories.' });
  }
});

// GET /api/services/:id - Get specific service
router.get('/:id', (req, res) => {
  try {
    const service = getServiceById(req.params.id);
    if (!service) {
      return res.status(404).json({ success: false, error: 'Service not found.' });
    }
    return res.json({ success: true, data: service });
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Failed to fetch service.' });
  }
});

// POST /api/services - Admin add service
router.post('/', (req, res) => {
  try {
    const newService = req.body;
    if (!newService.name_en || !newService.name_ml) {
      return res.status(400).json({ success: false, error: 'Service names in English and Malayalam are required.' });
    }

    const all = getAllServices();
    const serviceId = newService.id || `custom-service-${Date.now()}`;
    const entry = {
      ...newService,
      id: serviceId,
      number: all.length + 1,
      last_verified_date: new Date().toISOString().slice(0, 10)
    };
    all.push(entry);

    return res.status(201).json({ success: true, message: 'Service added successfully.', data: entry });
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Failed to create service.' });
  }
});

// PUT /api/services/:id - Admin update service
router.put('/:id', (req, res) => {
  try {
    const service = getServiceById(req.params.id);
    if (!service) {
      return res.status(404).json({ success: false, error: 'Service not found.' });
    }

    Object.assign(service, req.body, {
      updated_at: new Date().toISOString(),
      last_verified_date: new Date().toISOString().slice(0, 10)
    });

    return res.json({ success: true, message: 'Service updated successfully.', data: service });
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Failed to update service.' });
  }
});

// DELETE /api/services/:id - Admin soft-delete / disable service
router.delete('/:id', (req, res) => {
  try {
    const all = getAllServices();
    const idx = all.findIndex(s => s.id === req.params.id);
    if (idx === -1) {
      return res.status(404).json({ success: false, error: 'Service not found.' });
    }

    all[idx].is_active = false;
    return res.json({ success: true, message: 'Service disabled successfully.' });
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Failed to disable service.' });
  }
});

module.exports = router;
