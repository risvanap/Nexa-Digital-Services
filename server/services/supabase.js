const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

let supabase = null;
const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY && !SUPABASE_URL.includes('your-supabase-url'));

if (isSupabaseConfigured) {
  try {
    supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });
    console.log('✅ Supabase client initialized successfully.');
  } catch (err) {
    console.error('❌ Failed to initialize Supabase client:', err.message);
    supabase = null;
  }
} else {
  console.log('ℹ️ Supabase credentials not found or placeholder used. Operating in robust local-store mode.');
}

// Local fallback file store
const LOCAL_STORE_FILE = path.join(__dirname, '..', 'data', 'local-enquiries.json');

function readLocalEnquiries() {
  try {
    if (fs.existsSync(LOCAL_STORE_FILE)) {
      return JSON.parse(fs.readFileSync(LOCAL_STORE_FILE, 'utf-8'));
    }
  } catch (e) {
    console.error('Error reading local enquiries file:', e);
  }
  return [];
}

function writeLocalEnquiries(data) {
  try {
    fs.writeFileSync(LOCAL_STORE_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (e) {
    console.error('Error writing local enquiries file:', e);
  }
}

/**
 * Generate a unique customer enquiry reference number: e.g. NX-2026-8942
 */
function generateReferenceId() {
  const year = new Date().getFullYear();
  const randNum = Math.floor(1000 + Math.random() * 9000);
  return `NX-${year}-${randNum}`;
}

/**
 * Save new customer enquiry
 */
async function saveEnquiry(enquiry) {
  const reference_id = generateReferenceId();
  const now = new Date().toISOString();

  const record = {
    id: crypto.randomUUID(),
    reference_id,
    customer_name: enquiry.customer_name || 'Citizen',
    mobile_number: enquiry.mobile_number,
    service_key: enquiry.service_key || 'general',
    service_name: enquiry.service_name || 'General Inquiry',
    application_type: enquiry.application_type || 'General Assistance',
    short_description: enquiry.short_description || '',
    preferred_contact_method: enquiry.preferred_contact_method || 'whatsapp',
    preferred_language: enquiry.preferred_language || 'ml',
    status: 'pending',
    internal_notes: '',
    assigned_to: 'Nexa Desk Operator',
    whatsapp_sent: true,
    created_at: now,
    updated_at: now
  };

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('customer_enquiries')
        .insert([record])
        .select()
        .single();

      if (error) {
        console.error('Supabase insert error, falling back to local file:', error.message);
      } else {
        return data;
      }
    } catch (err) {
      console.error('Supabase exception, falling back to local file:', err.message);
    }
  }

  // Fallback to local store
  const localList = readLocalEnquiries();
  localList.unshift(record);
  writeLocalEnquiries(localList);
  return record;
}

/**
 * Get enquiries with optional filters
 */
async function getEnquiries({ status, search, service_key, limit = 50, offset = 0 } = {}) {
  if (supabase) {
    try {
      let query = supabase
        .from('customer_enquiries')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (status && status !== 'all') {
        query = query.eq('status', status);
      }
      if (service_key && service_key !== 'all') {
        query = query.eq('service_key', service_key);
      }
      if (search) {
        query = query.or(`customer_name.ilike.%${search}%,mobile_number.ilike.%${search}%,reference_id.ilike.%${search}%`);
      }

      const { data, count, error } = await query;
      if (!error && data) {
        return { data, total: count || data.length };
      }
      console.error('Supabase fetch error, using local fallback:', error?.message);
    } catch (err) {
      console.error('Supabase error:', err.message);
    }
  }

  // Fallback
  let items = readLocalEnquiries();
  if (status && status !== 'all') {
    items = items.filter(i => i.status === status);
  }
  if (service_key && service_key !== 'all') {
    items = items.filter(i => i.service_key === service_key);
  }
  if (search) {
    const s = search.toLowerCase();
    items = items.filter(i =>
      (i.customer_name && i.customer_name.toLowerCase().includes(s)) ||
      (i.mobile_number && i.mobile_number.includes(s)) ||
      (i.reference_id && i.reference_id.toLowerCase().includes(s)) ||
      (i.service_name && i.service_name.toLowerCase().includes(s))
    );
  }

  const total = items.length;
  const paged = items.slice(offset, offset + limit);
  return { data: paged, total };
}

/**
 * Get enquiry by reference ID or UUID
 */
async function getEnquiryById(idOrRef) {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('customer_enquiries')
        .select('*')
        .or(`id.eq.${idOrRef},reference_id.eq.${idOrRef}`)
        .single();
      if (!error && data) return data;
    } catch (e) {
      console.error('Supabase get error:', e.message);
    }
  }

  const items = readLocalEnquiries();
  return items.find(i => i.id === idOrRef || i.reference_id === idOrRef) || null;
}

/**
 * Update enquiry status and internal notes
 */
async function updateEnquiry(id, { status, internal_notes, assigned_to }) {
  const now = new Date().toISOString();
  const updates = { updated_at: now };
  if (status) updates.status = status;
  if (internal_notes !== undefined) updates.internal_notes = internal_notes;
  if (assigned_to !== undefined) updates.assigned_to = assigned_to;

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('customer_enquiries')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (!error && data) return data;
    } catch (e) {
      console.error('Supabase update error:', e.message);
    }
  }

  const items = readLocalEnquiries();
  const idx = items.findIndex(i => i.id === id || i.reference_id === id);
  if (idx !== -1) {
    items[idx] = { ...items[idx], ...updates };
    writeLocalEnquiries(items);
    return items[idx];
  }
  return null;
}

/**
 * Get Dashboard statistics
 */
async function getStats() {
  const { data: allItems } = await getEnquiries({ limit: 1000 });
  const total = allItems.length;

  const todayStr = new Date().toISOString().slice(0, 10);
  const todayCount = allItems.filter(i => (i.created_at || '').slice(0, 10) === todayStr).length;
  const pendingCount = allItems.filter(i => i.status === 'pending').length;
  const completedCount = allItems.filter(i => i.status === 'completed').length;
  const inProgressCount = allItems.filter(i => i.status === 'in_progress').length;

  return {
    total,
    today: todayCount,
    pending: pendingCount,
    in_progress: inProgressCount,
    completed: completedCount,
    recent: allItems.slice(0, 5)
  };
}

module.exports = {
  supabase,
  isSupabaseConfigured,
  saveEnquiry,
  getEnquiries,
  getEnquiryById,
  updateEnquiry,
  getStats
};
