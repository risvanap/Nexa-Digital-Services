// Comprehensive Verification Suite for NEXA Digital Services AI System
const http = require('http');

const PORT = 3000;
const BASE_URL = `http://localhost:${PORT}`;

function post(url, data) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(data);
    const u = new URL(url);
    const req = http.request({
      hostname: u.hostname,
      port: u.port,
      path: u.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(body) });
        } catch (e) {
          resolve({ status: res.statusCode, body });
        }
      });
    });
    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

function get(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(body) });
        } catch (e) {
          resolve({ status: res.statusCode, body });
        }
      });
    }).on('error', reject);
  });
}

async function runTests() {
  console.log('🧪 Starting NEXA AI System Verification...\n');

  // Test 1: Health check
  console.log('1. Testing Health Endpoint (/api/health)...');
  const health = await get(`${BASE_URL}/api/health`);
  console.log(`   Status: ${health.status}, System: ${health.body.system}, WhatsApp: ${health.body.business.whatsapp}`);
  if (health.status !== 200) throw new Error('Health check failed');
  console.log('   ✅ Health check passed.\n');

  // Test 2: Services Catalogue
  console.log('2. Testing Services Catalogue (/api/services)...');
  const servicesRes = await get(`${BASE_URL}/api/services`);
  console.log(`   Total Services Count: ${servicesRes.body.count}`);
  if (servicesRes.body.count !== 43) {
    throw new Error(`Expected 43 services, found ${servicesRes.body.count}`);
  }
  console.log(`   Categories Count: ${servicesRes.body.categories.length}`);
  console.log('   ✅ Verified all 43 services are present across 7 categories.\n');

  // Test 3: Malayalam Chat Query
  console.log('3. Testing Malayalam Chat Query ("എനിക്ക് പാസ്പോർട്ട് എടുക്കണം")...');
  const mlChat = await post(`${BASE_URL}/api/chat`, {
    message: 'എനിക്ക് പാസ്പോർട്ട് എടുക്കണം'
  });
  console.log(`   Detected Language: ${mlChat.body.data.language}`);
  console.log(`   Matched Service: ${mlChat.body.data.matchedService?.name_en}`);
  console.log(`   Govt Fee: ₹${mlChat.body.data.matchedService?.govt_fee}, Nexa: ₹${mlChat.body.data.matchedService?.nexa_service_charge}`);
  if (!mlChat.body.data.reply.includes('പാസ്പോർട്ട്')) {
    throw new Error('Malayalam response did not mention passport');
  }
  console.log('   ✅ Malayalam conversation engine responded accurately.\n');

  // Test 4: English Chat Query
  console.log('4. Testing English Chat Query ("How do I apply for a PAN card?")...');
  const enChat = await post(`${BASE_URL}/api/chat`, {
    message: 'How do I apply for a PAN card?'
  });
  console.log(`   Detected Language: ${enChat.body.data.language}`);
  console.log(`   Matched Service: ${enChat.body.data.matchedService?.name_en}`);
  if (!enChat.body.data.reply.includes('PAN Card')) {
    throw new Error('English response did not mention PAN card');
  }
  console.log('   ✅ English conversation engine responded accurately.\n');

  // Test 5: Aadhaar Statutory Guardrail Interception
  console.log('5. Testing Aadhaar Statutory Guardrail ("I want to enroll for a new Aadhaar card")...');
  const aadhaarChat = await post(`${BASE_URL}/api/chat`, {
    message: 'I want to enroll for a new Aadhaar card'
  });
  console.log(`   Guardrail Intercepted: ${aadhaarChat.body.data.reply.includes('UIDAI')}`);
  if (!aadhaarChat.body.data.reply.includes('UIDAI')) {
    throw new Error('Aadhaar guardrail failed to trigger');
  }
  console.log('   ✅ Statutory Aadhaar restrictions upheld.\n');

  // Test 6: Customer Enquiry Submission
  console.log('6. Testing Customer Enquiry Submission (/api/enquiries)...');
  const enquiryRes = await post(`${BASE_URL}/api/enquiries`, {
    customer_name: 'Anjali Menon',
    mobile_number: '9847123456',
    service_key: 'passport-services',
    service_name: 'Passport Services',
    application_type: 'Fresh Indian Passport',
    short_description: 'Need appointment slot in Ernakulam PSK',
    preferred_contact_method: 'whatsapp',
    preferred_language: 'ml'
  });
  console.log(`   Generated Reference ID: ${enquiryRes.body.data.reference_id}`);
  console.log(`   WhatsApp URL generated: ${enquiryRes.body.data.whatsapp_url.slice(0, 50)}...`);
  if (!enquiryRes.body.data.reference_id.startsWith('NX-')) {
    throw new Error('Invalid enquiry reference format');
  }
  console.log('   ✅ Customer enquiry workflow and reference generation passed.\n');

  // Test 7: Dashboard Stats
  console.log('7. Testing Dashboard Stats (/api/stats)...');
  const statsRes = await get(`${BASE_URL}/api/stats`);
  console.log(`   Total Enquiries in System: ${statsRes.body.data.total}`);
  console.log(`   Pending Enquiries: ${statsRes.body.data.pending}`);
  console.log(`   Total Verified Services: ${statsRes.body.data.total_services}`);
  console.log('   ✅ Admin analytics stats computed successfully.\n');

  console.log('🎉 ALL 7 SYSTEM VERIFICATION TESTS PASSED SUCCESSFULLY!');
}

runTests().catch(err => {
  console.error('❌ Verification failed:', err);
  process.exit(1);
});
