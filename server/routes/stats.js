const express = require('express');
const router = express.Router();
const { getStats } = require('../services/supabase');
const { getAllServices } = require('../services/knowledge-base');

// GET /api/stats - Dashboard metrics
router.get('/stats', async (req, res) => {
  try {
    const stats = await getStats();
    const services = getAllServices();

    return res.json({
      success: true,
      data: {
        ...stats,
        total_services: services.length,
        verified_date: new Date().toISOString().slice(0, 10)
      }
    });
  } catch (error) {
    console.error('Stats fetch error:', error);
    return res.status(500).json({ success: false, error: 'Failed to compute stats.' });
  }
});

// GET /api/health - System health check
router.get('/health', (req, res) => {
  const isAiActive = Boolean(process.env.OPENAI_API_KEY && !process.env.OPENAI_API_KEY.includes('your-openai-api-key'));
  const isSupabaseActive = Boolean(process.env.SUPABASE_URL && !process.env.SUPABASE_URL.includes('your-supabase-url'));

  return res.json({
    status: 'healthy',
    system: 'NEXA AI Customer Support Assistant',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    uptime_seconds: Math.floor(process.uptime()),
    providers: {
      ai_mode: isAiActive ? 'OpenAI GPT API' : 'Intelligent Local Conversational Engine',
      database_mode: isSupabaseActive ? 'Supabase PostgreSQL' : 'Resilient File Store'
    },
    business: {
      name: 'NEXA DIGITAL SERVICES',
      location: 'Kerala, India',
      whatsapp: '+91 8086380373',
      services_count: 43
    }
  });
});

module.exports = router;
