/**
 * Nexa Digital Services - Internationalization (i18n) Engine
 * Seamlessly manages Malayalam (മലയാളം), English, and Bilingual displays.
 */

const I18N_STORAGE_KEY = 'nexa_lang_pref';

const TRANSLATIONS = {
  en: {
    brand_sub: "Independent Citizen Digital Services Center • Kerala",
    brand_sub_mobile: "Independent Citizen Center • Kerala",
    nav_home: "Home",
    nav_services: "Services",
    nav_about: "About Us",
    nav_contact: "Contact",
    nav_track: "Track Status",
    btn_call: "Call Us",
    btn_whatsapp: "WhatsApp Enquiry",
    btn_apply_now: "Apply Now",
    btn_explore: "Explore Services",
    btn_whatsapp_apply: "Apply via WhatsApp",
    btn_direct_upload: "Direct Upload",
    btn_request_callback: "Request Callback",
    hero_title: "All Citizen Digital Services in One Place",
    hero_subtitle: "Independent Citizen Facilitation Center • Kerala",
    hero_desc: "Skip long queues. Fast, transparent online application submission for certificates, ID cards, and government welfare benefits.",
    hero_hours: "Helpdesk Online Now (Mon – Sat 8:30 AM – 7:30 PM)",
    search_placeholder: "Search across 45+ digital services... (e.g. Income, PAN, PSC, Ration)",
    cat_all: "All Services",
    cat_certificates: "Certificates",
    cat_id_cards: "ID Cards & PAN",
    cat_passport: "Passport",
    cat_pan: "PAN Services",
    cat_ration: "Ration Card",
    cat_job: "PSC & Jobs",
    cat_print: "Printing & PDF",
    popular_title: "Popular Facilitation Services",
    popular_sub: "Most requested citizen services in Kerala",
    how_it_works_title: "How It Works",
    how_it_works_sub: "Simple 3-Step Hassle Free Process",
    step1_title: "1. Select Service & Connect",
    step1_desc: "Pick your required certificate or service from our catalog or message us directly on WhatsApp.",
    step2_title: "2. Send or Submit Documents",
    step2_desc: "Share your Aadhaar, photo and documents via WhatsApp or hand them over in person at our center.",
    step3_title: "3. Receive Acknowledgement & Certificate",
    step3_desc: "Get immediate application tracking ID via SMS, and receive your verified digital certificate on your phone.",
    why_title: "Why Choose Nexa Services?",
    why_sub: "Dependable, Transparent & Civic-Grade",
    prop1_title: "Error-Free Submission",
    prop1_desc: "Double verification of every record to eliminate rejection risks.",
    prop2_title: "100% Transparent Fees",
    prop2_desc: "Government portal receipts provided directly with zero hidden charges.",
    prop3_title: "Live SMS & WhatsApp Updates",
    prop3_desc: "Track every step of your file from desk scrutiny to official approval.",
    prop4_title: "Panchayat Doorstep Assistance",
    prop4_desc: "Special doorstep biometric verification for bedridden and senior citizens.",
    checklist_title: "Essential Documents Checklist",
    checklist_sub: "Keep these documents ready for quick processing",
    faq_title: "Frequently Asked Questions",
    faq_sub: "Common questions about independent citizen services in Kerala",
    branches_title: "Physical Facilitation Desks & Hours",
    branches_sub: "Visit our modern walk-in centers across Kerala",
    disclaimer_note: "Statutory Citizen Information Note",
    disclaimer_text: "Disclaimer: Nexa Digital Services is an independent citizen digital facilitation center. We provide technical and administrative assistance to help common citizens submit online applications to state and central portals. Official statutory fees are transferred directly to designated government departments.",
    footer_rights: "© 2026 Nexa Digital Services. All rights reserved. Independent Citizen Center."
  },
  ml: {
    brand_sub: "സ്വതന്ത്ര പൗര ഡിജിറ്റൽ സേവന കേന്ദ്രം • കേരളം",
    brand_sub_mobile: "സ്വതന്ത്ര പൗര സേവന കേന്ദ്രം • കേരളം",
    nav_home: "ഹോം",
    nav_services: "സേവനങ്ങൾ",
    nav_about: "ഞങ്ങളെക്കുറിച്ച്",
    nav_contact: "ബന്ധപ്പെടുക",
    nav_track: "സ്റ്റാറ്റസ് പരിശോധിക്കുക",
    btn_call: "വിളിക്കുക",
    btn_whatsapp: "വാട്സാപ്പ് സഹായം",
    btn_apply_now: "അപേക്ഷിക്കുക",
    btn_explore: "സേവനങ്ങൾ കാണുക",
    btn_whatsapp_apply: "വാട്സാപ്പ് വഴി അപേക്ഷിക്കാം",
    btn_direct_upload: "രേഖകൾ അപ്‌ലോഡ് ചെയ്യാം",
    btn_request_callback: "തിരിച്ചുവിളിക്കാൻ അപേക്ഷിക്കുക",
    hero_title: "എല്ലാ ഡിജിറ്റൽ സേവനങ്ങളും ഒരിടത്ത്",
    hero_subtitle: "സ്വതന്ത്ര ഡിജിറ്റൽ സേവന കേന്ദ്രം • കേരളം",
    hero_desc: "ക്യൂ നിൽക്കാതെ വേഗത്തിലും സുരക്ഷിതമായും സർട്ടിഫിക്കറ്റുകളും ഓൺലൈൻ അപേക്ഷകളും സമർപ്പിക്കാം. സുതാര്യമായ സേവനം.",
    hero_hours: "സഹായ ഡെസ്ക് ഇപ്പോൾ ലഭ്യമാണ് (തിങ്കൾ – ശനി 8:30 AM – 7:30 PM)",
    search_placeholder: "സേവനം തിരയുക (ഉദാ: വരുമാന സർട്ടിഫിക്കറ്റ്, പാൻ കാർഡ്, റേഷൻ, പി.എസ്.സി)...",
    cat_all: "എല്ലാം",
    cat_certificates: "സർട്ടിഫിക്കറ്റുകൾ",
    cat_id_cards: "തിരിച്ചറിയൽ രേഖകൾ",
    cat_passport: "പാസ്‌പോർട്ട്",
    cat_pan: "പാൻ കാർഡ്",
    cat_ration: "റേഷൻ കാർഡ്",
    cat_job: "PSC & പരീക്ഷകൾ",
    cat_print: "പ്രിന്റിംഗ് & PDF",
    popular_title: "പ്രധാന സേവനങ്ങൾ",
    popular_sub: "കേരളത്തിൽ ഏറ്റവും കൂടുതൽ ആളുകൾ ആവശ്യപ്പെടുന്ന ഡിജിറ്റൽ സേവനങ്ങൾ",
    how_it_works_title: "എങ്ങനെ പ്രവർത്തിക്കുന്നു?",
    how_it_works_sub: "ലളിതമായ 3 ഘട്ടങ്ങളിലൂടെ സേവനം നേടാം",
    step1_title: "1. സേവനം തിരഞ്ഞെടുക്കുക",
    step1_desc: "നിങ്ങൾക്ക് ആവശ്യമുള്ള സർട്ടിഫിക്കറ്റ് അല്ലെങ്കിൽ അപേക്ഷ ലിസ്റ്റിൽ നിന്നോ വാട്സാപ്പിലൂടെയോ അറിയിക്കുക.",
    step2_title: "2. രേഖകൾ അയക്കുക / എത്തിക്കുക",
    step2_desc: "ആവശ്യമായ ഫോട്ടോയും ആധാർ ഉൾപ്പെടെയുള്ള രേഖകളും വാട്സാപ്പിൽ അയക്കുക അല്ലെങ്കിൽ സെന്ററിൽ നേരിട്ട് നൽകുക.",
    step3_title: "3. അക്നോളജ്മെന്റും സർട്ടിഫിക്കറ്റും",
    step3_desc: "അപേക്ഷ കൃത്യമായി സമർപ്പിച്ച് ട്രാക്കിംഗ് വിവരങ്ങളും അന്തിമ സർട്ടിഫിക്കറ്റും നിങ്ങളുടെ ഫോണിൽ ലഭ്യമാക്കുന്നു.",
    why_title: "എന്തുകൊണ്ട് നെക്സ സർവീസസ്?",
    why_sub: "വിശ്വാസ്യത, കൃത്യത, സുതാര്യത",
    prop1_title: "തെറ്റുകളില്ലാത്ത അപേക്ഷ",
    prop1_desc: "റിജക്ഷൻ സാധ്യത ഒഴിവാക്കാൻ വിദഗ്ദ്ധരുടെ ഡബിൾ വെരിഫിക്കേഷൻ.",
    prop2_title: "സുതാര്യമായ ഫീസ്",
    prop2_desc: "സർക്കാർ രസീത് സഹിതം കൃത്യമായ നിരക്കുകൾ. മറഞ്ഞിരിക്കുന്ന ചാർജുകളില്ല.",
    prop3_title: "SMS / വാട്സാപ്പ് അപ്‌ഡേറ്റ്",
    prop3_desc: "അപേക്ഷയുടെ ഓരോ ഘട്ടത്തിലും തത്സമയ സന്ദേശങ്ങൾ ഫോണിൽ ലഭിക്കും.",
    prop4_title: "വീട്ടുപടിക്കൽ സഹായം",
    prop4_desc: "മുതിർന്നവർക്കും കിടപ്പുരോഗികൾക്കും ബയോമെട്രിക് സഹായത്തിന് പ്രത്യേക പിന്തുണ.",
    checklist_title: "രേഖകളുടെ ചെക്ക്‌ലിസ്റ്റ്",
    checklist_sub: "അപേക്ഷയ്ക്ക് മുൻപ് ഈ രേഖകൾ കയ്യിലുണ്ടെന്ന് ഉറപ്പാക്കുക",
    faq_title: "പതിവ് ചോദ്യങ്ങൾ (FAQ)",
    faq_sub: "പൊതുജനങ്ങൾ സാധാരണയായി ചോദിക്കുന്ന സംശയങ്ങളും ഉത്തരങ്ങളും",
    branches_title: "പ്രവർത്തന സമയവും കേന്ദ്രങ്ങളും",
    branches_sub: "ഞങ്ങളുടെ ശാഖകൾ നേരിട്ട് സന്ദർശിക്കാം",
    disclaimer_note: "നിയമപരമായ നിരാകരണം (Statutory Notice)",
    disclaimer_text: "നിരാകരണം: നെക്സ ഡിജിറ്റൽ സർവീസസ് ഒരു സ്വതന്ത്ര പൗര സഹായ കേന്ദ്രമാണ്. സർക്കാർ അപേക്ഷകൾ പൊതുജനങ്ങൾക്ക് എളുപ്പത്തിൽ സമർപ്പിക്കാനുള്ള സാങ്കേതിക സഹായം മാത്രമാണ് നൽകുന്നത്. ഔദ്യോഗിക ഫീസുകൾ സർക്കാർ വകുപ്പുകളിലേക്ക് നേരിട്ട് കൈമാറുന്നതാണ്.",
    footer_rights: "© 2026 നെക്സ ഡിജിറ്റൽ സർവീസസ്. എല്ലാ അവകാശങ്ങളും നിക്ഷിപ്തം. സ്വതന്ത്ര പൗര സേവന കേന്ദ്രം."
  }
};

class I18nManager {
  constructor() {
    this.currentLang = localStorage.getItem(I18N_STORAGE_KEY) || 'ml'; // Default to Malayalam as primary regional script
    document.documentElement.lang = this.currentLang === 'ml' ? 'ml' : 'en';
  }

  getLang() {
    return this.currentLang;
  }

  toggleLang() {
    this.currentLang = this.currentLang === 'ml' ? 'en' : 'ml';
    localStorage.setItem(I18N_STORAGE_KEY, this.currentLang);
    document.documentElement.lang = this.currentLang;
    this.applyTranslations();
    // Dispatch custom event for components to react
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang: this.currentLang } }));
  }

  setLang(lang) {
    if (lang === 'ml' || lang === 'en') {
      this.currentLang = lang;
      localStorage.setItem(I18N_STORAGE_KEY, this.currentLang);
      document.documentElement.lang = this.currentLang;
      this.applyTranslations();
      window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang: this.currentLang } }));
    }
  }

  t(key) {
    const langDict = TRANSLATIONS[this.currentLang] || TRANSLATIONS['ml'];
    return langDict[key] || TRANSLATIONS['en'][key] || key;
  }

  applyTranslations() {
    // Update elements with data-i18n attribute
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(el => {
      const key = el.getAttribute('data-i18n');
      const val = this.t(key);
      if (val) {
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
          el.placeholder = val;
        } else {
          el.innerText = val;
        }
      }
    });

    // Update Language Toggle Buttons text
    const langBtns = document.querySelectorAll('.lang-toggle-btn');
    langBtns.forEach(btn => {
      if (this.currentLang === 'ml') {
        btn.innerHTML = `<span class="text-secondary font-bold">മല</span><span class="text-outline-variant px-0.5">|</span><span class="text-on-surface-variant font-medium">ENG</span>`;
      } else {
        btn.innerHTML = `<span class="text-on-surface-variant font-medium">മല</span><span class="text-outline-variant px-0.5">|</span><span class="text-secondary font-bold">ENG</span>`;
      }
    });
  }
}

// Global singleton
window.i18n = new I18nManager();
