const fs = require('fs');
const path = require('path');

let services = [];
let faqs = [];

try {
  services = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'services-knowledge.json'), 'utf-8'));
  faqs = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'faqs-knowledge.json'), 'utf-8'));
} catch (err) {
  console.error('Error loading knowledge base data:', err);
}

// Master Category definitions
const CATEGORIES = [
  { id: 'gov', name_en: 'Government Services', name_ml: 'സർക്കാർ സേവനങ്ങൾ', icon: 'account_balance' },
  { id: 'identity', name_en: 'Identity & Document Services', name_ml: 'തിരിച്ചറിയൽ രേഖാ സേവനങ്ങൾ', icon: 'badge' },
  { id: 'business', name_en: 'Business & Registration Services', name_ml: 'ബിസിനസ്സ് & രജിസ്ട്രേഷൻ സേവനങ്ങൾ', icon: 'business' },
  { id: 'education', name_en: 'Education & Career Services', name_ml: 'വിദ്യാഭ്യാസ & തൊഴിൽ സേവനങ്ങൾ', icon: 'school' },
  { id: 'vehicle', name_en: 'Vehicle & Transport Services', name_ml: 'വാഹന & ഗതാഗത സേവനങ്ങൾ', icon: 'directions_car' },
  { id: 'financial', name_en: 'Financial & Payment Services', name_ml: 'സാമ്പത്തിക & പേയ്മെന്റ് സേവനങ്ങൾ', icon: 'payments' },
  { id: 'travel', name_en: 'Travel & Other Services', name_ml: 'യാത്ര & മറ്റ് സേവനങ്ങൾ', icon: 'flight_takeoff' }
];

function getAllServices() {
  return services;
}

function getServiceById(id) {
  return services.find(s => s.id === id || s.number === Number(id));
}

function getServicesByCategory(categoryId) {
  return services.filter(s => s.category_id === categoryId);
}

function getAllFaqs() {
  return faqs;
}

function getAllCategories() {
  return CATEGORIES;
}

function searchServices(query) {
  if (!query || typeof query !== 'string') return [];
  const q = query.toLowerCase().trim();

  return services.filter(s => {
    return s.name_en.toLowerCase().includes(q) ||
           s.name_ml.includes(q) ||
           s.description_en.toLowerCase().includes(q) ||
           s.description_ml.includes(q) ||
           s.subservices.some(sub => sub.name_en.toLowerCase().includes(q) || sub.name_ml.includes(q));
  });
}

// Find closest matching service from user text
function matchServiceFromText(text) {
  if (!text) return null;
  const t = text.toLowerCase();

  // Keyword mappings
  const keywordMap = [
    { keys: ['passport', 'പാസ്പോർട്ട്', 'വിസ', 'പോപ്സ്ക്', 'tatkaal'], serviceId: 'passport-services' },
    { keys: ['pan', 'പാൻ', 'പാൻ കാർഡ്', 'pan card', 'nsdl', 'uti'], serviceId: 'pan-card-services' },
    { keys: ['ration', 'റേഷൻ', 'റേഷൻ കാർഡ്', 'food card', 'civil supplies'], serviceId: 'ration-card-services' },
    { keys: ['village', 'വില്ലേജ്', 'വരുമാനം', 'income cert', 'caste', 'ജാതി', 'nativity', 'നേറ്റിവിറ്റി', 'possession', 'കൈവശാവകാശം'], serviceId: 'village-services' },
    { keys: ['panchayath', 'municipality', 'പഞ്ചായത്ത്', 'മുനിസിപ്പാലിറ്റി', 'ജനനം', 'മരണം', 'വിവാഹം', 'birth', 'death', 'marriage', 'ksmart', 'സേവന'], serviceId: 'panchayath-municipality-services' },
    { keys: ['registration', 'pearl', 'ആധാരം', 'കുടിക്കട', 'encumbrance', 'ec', 'ന്യായവില'], serviceId: 'registration-department-services' },
    { keys: ['police', 'പോലീസ്', 'pcc', 'clearance', 'തുണ', 'thuna'], serviceId: 'police-department-services' },
    { keys: ['cmdrf', 'മുഖ്യമന്ത്രി', 'ദുരിതാശ്വാസം', 'cmo', 'ചികിത്സാ സഹായം'], serviceId: 'cm-grievance-cmdrf' },
    { keys: ['welfare', 'ക്ഷേമനിധി', 'തൊഴിലാളി', 'അംശദായം', 'bocw'], serviceId: 'welfare-registrations-epayments' },
    { keys: ['labour', 'തൊഴിൽ', 'കട', 'ഷോപ്പ്', 'lcas', 'ആവാസ്', 'awaz'], serviceId: 'labour-department-services' },
    { keys: ['voter', 'വോട്ടർ', 'തിരിച്ചറിയൽ കാർഡ്', 'election', 'epic', 'form 6', 'form 8'], serviceId: 'voter-id-services' },
    { keys: ['eshram', 'e-shram', 'ഇ-ശ്രം', 'ഇശ്രം', 'uan'], serviceId: 'e-shram-card-services' },
    { keys: ['dsc', 'digital signature', 'ഡിജിറ്റൽ സിഗ്നേച്ചർ', 'ടോക്കൺ', 'token'], serviceId: 'digital-signature-certificate' },
    { keys: ['company', 'കമ്പനി', 'pvt ltd', 'llp', 'opc', 'mca', 'ഡയറക്ടർ'], serviceId: 'company-registration' },
    { keys: ['gst', 'ജിഎസ്ടി', 'ജി.എസ്.ടി', 'gstr', 'eway bill'], serviceId: 'gst-services' },
    { keys: ['trademark', 'ട്രേഡ്മാർക്ക്', 'ലോഗോ', 'brand name', 'tm'], serviceId: 'trademark-registration' },
    { keys: ['udyam', 'ഉദ്യം', 'msme', 'എംഎസ്എംഇ', 'ചെറുകിട വ്യവസായം'], serviceId: 'msme-udyam-registration' },
    { keys: ['kswift', 'കെ-സ്വിഫ്റ്റ്', 'കെസ്വിഫ്റ്റ്', 'ഏകജാലകം', 'single window'], serviceId: 'kswift-registration' },
    { keys: ['fssai', 'ഭക്ഷ്യ സുരക്ഷ', 'ഫുഡ് ലൈസൻസ്', 'foscos', 'ഹോട്ടൽ ലൈസൻസ്'], serviceId: 'fssai-food-safety-registration' },
    { keys: ['website', 'വെബ്സൈറ്റ്', 'web design', 'online store', 'ഡൊമെയ്ൻ'], serviceId: 'website-development' },
    { keys: ['university', 'യൂണിവേഴ്സിറ്റി', 'സർവ്വകലാശാല', 'ഡിഗ്രി', 'degree', 'migration', 'മൈഗ്രേഷൻ', 'calicut', 'kerala univ', 'mg univ', 'ktu'], serviceId: 'university-services' },
    { keys: ['psc', 'പിഎസ്സി', 'പി.എസ്.സി', 'തുളസി', 'thulasi', 'otr', 'confirmation'], serviceId: 'psc-related-services' },
    { keys: ['employment', 'എംപ്ലോയ്മെന്റ്', 'സീനിയോറിറ്റി', 'exchange'], serviceId: 'employment-registration' },
    { keys: ['sslc', 'പ്ലസ് ടു', 'plus two', 'പരീക്ഷാ ഭവൻ', 'pareeksha', 'duplicate cert'], serviceId: 'educational-related-services' },
    { keys: ['scholarship', 'സ്കോളർഷിപ്പ്', 'nsp', 'dce', 'പോസ്റ്റ് മെട്രിക്'], serviceId: 'scholarship-services' },
    { keys: ['ssc', 'upsc', 'railway', 'rrb', 'bank exam', 'ibps', 'തൊഴിൽ അപേക്ഷ', 'ജോലി'], serviceId: 'job-related-applications' },
    { keys: ['ug cap', 'ഡിഗ്രി അഡ്മിഷൻ', 'ug admission', 'degree cap', 'ഓപ്ഷൻ'], serviceId: 'ug-cap-admission' },
    { keys: ['pg cap', 'പിജി അഡ്മിഷൻ', 'pg admission', 'msc', 'mcom', 'ma admission'], serviceId: 'pg-cap-admission' },
    { keys: ['rto', 'mvd', 'ലൈസൻസ്', 'driving licence', 'learner', 'ലേണേഴ്സ്', 'sarathi', 'സാരഥി'], serviceId: 'rto-mvd-services' },
    { keys: ['rc', 'ആർസി', 'വാഹൻ', 'vahan', 'rc transfer', 'ownership transfer', 'road tax', 'വാഹന നികുതി', 'fitness', 'ഫിറ്റ്നസ്'], serviceId: 'vehicle-related-services' },
    { keys: ['insurance', 'ഇൻഷുറൻസ്', 'പോളിസി', 'bike insurance', 'car insurance'], serviceId: 'insurance-services' },
    { keys: ['tax', 'നികുതി', 'ഭൂനികുതി', 'പോക്കുവരവ്', 'തണ്ടപ്പേര്', 'thandapper', 'sanchaya'], serviceId: 'tax-payment-services' },
    { keys: ['emi', 'ലോൺ', 'loan', 'വായ്പ തിരിച്ചടവ്', 'nbfc', 'muthoot', 'bajaj'], serviceId: 'loan-emi-payments' },
    { keys: ['pension', 'പെൻഷൻ', 'ജീവൻ പ്രമാൺ', 'jeevan pramaan', 'മസ്റ്ററിംഗ്', 'mustering', 'സേവന പെൻഷൻ'], serviceId: 'pension-services' },
    { keys: ['utility', 'യൂട്ടിലിറ്റി', 'ഗ്യാസ് ബിൽ', 'broadband bill', 'asianet', 'landline'], serviceId: 'utility-bill-payments' },
    { keys: ['kseb', 'കെഎസ്ഇബി', 'കറന്റ് ബിൽ', 'വൈദ്യുതി ബിൽ', 'electric connection', 'electricity bill'], serviceId: 'kseb-related-services' },
    { keys: ['kwa', 'water authority', 'വാട്ടർ അതോറിറ്റി', 'കുടിവെള്ള ബിൽ', 'water bill'], serviceId: 'kerala-water-authority-services' },
    { keys: ['mobile recharge', 'റീച്ചാർജ്ജ്', 'jio recharge', 'airtel recharge', 'bsnl recharge', 'vi recharge'], serviceId: 'mobile-recharge' },
    { keys: ['tv recharge', 'dth recharge', 'sun direct', 'tata play', 'dish tv'], serviceId: 'tv-recharge' },
    { keys: ['pravasi', 'പ്രവാസി', 'norka', 'നോർക്ക', 'പ്രവാസി ക്ഷേമം', 'pravasi id'], serviceId: 'pravasi-services' },
    { keys: ['flight', 'വിമാനം', 'ട്രെയിൻ', 'train booking', 'irctc', 'visit visa'], serviceId: 'travel-services' },
    { keys: ['ksrtc', 'കെഎസ്ആർടിസി', 'സ്വിഫ്റ്റ്', 'swift bus', 'ബസ് ടിക്കറ്റ്'], serviceId: 'ksrtc-bus-booking' },
    { keys: ['farmer', 'കർഷക', 'കൃഷി', 'pm kisan', 'പിഎം കിസാൻ', 'aims', 'വിള ഇൻഷുറൻസ്'], serviceId: 'farmers-related-services' }
  ];

  for (const item of keywordMap) {
    if (item.keys.some(k => t.includes(k))) {
      return getServiceById(item.serviceId);
    }
  }

  // Fallback direct name match
  for (const s of services) {
    if (t.includes(s.name_en.toLowerCase()) || t.includes(s.name_ml)) {
      return s;
    }
  }

  return null;
}

module.exports = {
  getAllServices,
  getServiceById,
  getServicesByCategory,
  getAllFaqs,
  getAllCategories,
  searchServices,
  matchServiceFromText
};
