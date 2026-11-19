const express = require('express');
const router = express.Router();
const { saveEnquiry, getEnquiries, getEnquiryById, updateEnquiry } = require('../services/supabase');

const BUSINESS_WHATSAPP = '918086380373';

/**
 * Generate formatted WhatsApp link with customer enquiry details
 */
function createWhatsAppEnquiryLink(record) {
  const isMl = record.preferred_language === 'ml';
  const text = isMl
    ? `നമസ്കാരം Nexa Digital Services! 👋\n\nഎന്റെ അപേക്ഷാ അന്വേഷണ നമ്പർ: *${record.reference_id}*\n\n• പേര്: ${record.customer_name}\n• ഫോൺ: ${record.mobile_number}\n• ആവശ്യമുള്ള സേവനം: *${record.service_name}*\n• പ്രത്യേക അപേക്ഷ: ${record.application_type || 'ജനറൽ'}\n${record.short_description ? `• വിവരണം: ${record.short_description}\n` : ''}\nഈ അപേക്ഷയിൽ സഹായിക്കുമോ? നന്ദി.`
    : `Hello Nexa Digital Services! 👋\n\nMy Enquiry Reference: *${record.reference_id}*\n\n• Name: ${record.customer_name}\n• Phone: ${record.mobile_number}\n• Required Service: *${record.service_name}*\n• Application Type: ${record.application_type || 'General'}\n${record.short_description ? `• Details: ${record.short_description}\n` : ''}\nCould you please assist me with this application? Thank you!`;

  return `https://wa.me/${BUSINESS_WHATSAPP}?text=${encodeURIComponent(text)}`;
}

// POST /api/enquiries - Public customer enquiry submission
router.post('/', async (req, res) => {
  try {
    const {
      customer_name,
      mobile_number,
      service_key,
      service_name,
      application_type,
      short_description,
      preferred_contact_method,
      preferred_language
    } = req.body;

    if (!customer_name || !customer_name.trim()) {
      return res.status(400).json({ error: 'Customer name is required.' });
    }

    if (!mobile_number || !mobile_number.trim()) {
      return res.status(400).json({ error: 'Mobile number is required.' });
    }

    // Basic Indian phone number sanity check (at least 10 digits)
    const digitsOnly = mobile_number.replace(/\D/g, '');
    if (digitsOnly.length < 10) {
      return res.status(400).json({ error: 'Please enter a valid 10-digit mobile number.' });
    }

    const saved = await saveEnquiry({
      customer_name: customer_name.trim(),
      mobile_number: mobile_number.trim(),
      service_key: service_key || 'general',
      service_name: service_name || 'General Inquiry',
      application_type: application_type || 'General Assistance',
      short_description: (short_description || '').trim(),
      preferred_contact_method: preferred_contact_method || 'whatsapp',
      preferred_language: preferred_language || 'ml'
    });

    const whatsapp_url = createWhatsAppEnquiryLink(saved);

    return res.status(201).json({
      success: true,
      message: 'Enquiry submitted successfully. Reference generated.',
      data: {
        id: saved.id,
        reference_id: saved.reference_id,
        customer_name: saved.customer_name,
        service_name: saved.service_name,
        whatsapp_url,
        created_at: saved.created_at
      }
    });
  } catch (error) {
    console.error('Enquiry creation error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to record enquiry. Please contact WhatsApp helpline directly.'
    });
  }
});

// GET /api/enquiries - Admin listing
router.get('/', async (req, res) => {
  try {
    const { status, search, service_key, limit, offset } = req.query;
    const result = await getEnquiries({
      status,
      search,
      service_key,
      limit: Number(limit) || 50,
      offset: Number(offset) || 0
    });

    return res.json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('Fetch enquiries error:', error);
    return res.status(500).json({ success: false, error: 'Failed to fetch enquiries.' });
  }
});

// GET /api/enquiries/:id - Admin single view
router.get('/:id', async (req, res) => {
  try {
    const item = await getEnquiryById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, error: 'Enquiry not found.' });
    }
    return res.json({ success: true, data: item });
  } catch (error) {
    console.error('Fetch enquiry detail error:', error);
    return res.status(500).json({ success: false, error: 'Failed to fetch enquiry details.' });
  }
});

// PATCH /api/enquiries/:id - Admin status and notes update
router.patch('/:id', async (req, res) => {
  try {
    const { status, internal_notes, assigned_to } = req.body;
    const updated = await updateEnquiry(req.params.id, {
      status,
      internal_notes,
      assigned_to
    });

    if (!updated) {
      return res.status(404).json({ success: false, error: 'Enquiry not found.' });
    }

    return res.json({
      success: true,
      message: 'Enquiry updated successfully.',
      data: updated
    });
  } catch (error) {
    console.error('Update enquiry error:', error);
    return res.status(500).json({ success: false, error: 'Failed to update enquiry.' });
  }
});

module.exports = router;
