/**
 * Nexa Digital Services - Premium Reusable Web Components
 * Desktop & Mobile Header, Bottom Navigation, Footers, Modals, Scroll Reveal & Floating WhatsApp
 */

const LOGO_SVG = `
<svg width="38" height="38" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" class="flex-shrink-0 transition-transform duration-300 group-hover:scale-105">
  <defs>
    <linearGradient id="nexaGrad" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#021c35"/>
      <stop offset="100%" stop-color="#0453cd"/>
    </linearGradient>
    <linearGradient id="nexaAccent" x1="0" y1="0" x2="48" y2="0" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#00a884"/>
      <stop offset="100%" stop-color="#8ff4e3"/>
    </linearGradient>
  </defs>
  <rect width="48" height="48" rx="12" fill="url(#nexaGrad)"/>
  <rect x="1.5" y="1.5" width="45" height="45" rx="10.5" stroke="#dae2ff" stroke-opacity="0.25" stroke-width="1.5"/>
  <path d="M13 35V13L24 26L35 13V35" stroke="url(#nexaAccent)" stroke-width="3.8" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="24" cy="18" r="3.2" fill="#356ee7" stroke="#ffffff" stroke-width="1.5"/>
</svg>
`;

const LOGO_IMG_URL = "https://lh3.googleusercontent.com/aida/AEtjO1We0EbwPbz-3dW1uL3zREU_A52bIPSSp7dfMEYKgxAjzItvWVI1KSSC9DPKJMDktowe-lz6bzj3d8f4nXFp_XvP90usjFBRwHkktm-mdTUtU8aKzdCfs628D14Wi5iO6SzsPK3rS-Ymve9Og_jTVxg_F5AJQwaXNK90DpokA4YSrZ4VlYe7lAfOPHwclrrxADp8zU5NFrx_ekgm-rA0m20KZRFIsr6MJnZwefGe0WFhIA";

/**
 * Render Header
 */
function renderHeader(activePage = 'home') {
  const container = document.getElementById('app-header');
  if (!container) return;

  const currentLang = window.i18n ? window.i18n.getLang() : (localStorage.getItem('nexa_lang') || 'ml');
  const isMl = currentLang === 'ml';

  const navLinks = [
    { id: 'home', href: 'index.html', labelEn: 'Home', labelMl: 'ഹോം' },
    { id: 'services', href: 'services.html', labelEn: 'Services', labelMl: 'സേവനങ്ങൾ' },
    { id: 'chat', href: 'chatbot.html', labelEn: 'NEXA AI Desk', labelMl: 'NEXA AI' },
    { id: 'about', href: 'about.html', labelEn: 'About Us', labelMl: 'ഞങ്ങളെക്കുറിച്ച്' },
    { id: 'contact', href: 'contact.html', labelEn: 'Contact', labelMl: 'ബന്ധപ്പെടുക' },
    { id: 'track', href: 'track.html', labelEn: 'Track Status', labelMl: 'സ്റ്റാറ്റസ്' }
  ];

  container.innerHTML = `
    <!-- Top Statutory Citizen Strip -->
    <div class="bg-gradient-to-r from-[#01284b] via-[#0453cd] to-[#01284b] text-white px-4 py-1.5 text-center flex items-center justify-center gap-2 text-xs font-medium border-b border-white/10 shadow-sm">
      <span class="inline-flex items-center gap-1.5 font-medium tracking-wide">
        <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        <span class="material-symbols-outlined text-emerald-300 text-[15px]">verified</span>
        <span>${isMl ? 'സ്വതന്ത്ര പൗര ഡിജിറ്റൽ സേവന കേന്ദ്രം • Kerala Citizen Facilitation Desk' : 'Authorized Independent Citizen Digital Services Center • Kerala'}</span>
      </span>
      <span class="hidden sm:inline-block text-white/40">•</span>
      <span class="hidden sm:inline-block text-white/80 text-[11px] font-normal">
        ${isMl ? 'ഔദ്യോഗിക ചലാൻ രസീത് സഹിതം' : 'Direct Government Portal Filing'}
      </span>
    </div>

    <!-- Main Navigation Bar -->
    <div class="h-20 px-4 md:px-8 max-w-7xl mx-auto flex items-center justify-between gap-4">
      <!-- Brand Logo & Title -->
      <a href="index.html" class="flex items-center gap-3 min-w-0 flex-shrink-0 group">
        <div class="flex items-center justify-center rounded-xl overflow-hidden shadow-sm group-hover:scale-105 transition-transform duration-300">
          <img src="${LOGO_IMG_URL}" alt="Nexa Digital Services Logo" class="h-10 w-auto object-contain hidden sm:block" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
          <div class="hidden">${LOGO_SVG}</div>
          <div class="sm:hidden">${LOGO_SVG}</div>
        </div>
        <div class="flex flex-col min-w-0">
          <span class="font-headline-sm text-headline-sm text-primary font-extrabold tracking-tight truncate leading-tight group-hover:text-secondary transition-colors">
            Nexa Services
          </span>
          <span class="font-label-sm text-label-sm text-secondary font-semibold tracking-tight truncate leading-tight flex items-center gap-1">
            <span>${isMl ? 'നെക്സ ഡിജിറ്റൽ സർവീസസ്' : 'Citizen Digital Facilitation'}</span>
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          </span>
        </div>
      </a>

      <!-- Desktop Nav Links -->
      <nav class="hidden md:flex items-center gap-1 lg:gap-1.5">
        ${navLinks.map(link => {
          const isActive = activePage === link.id;
          return `
            <a href="${link.href}" class="px-3.5 py-2 rounded-xl font-label-md text-label-md font-bold transition-all duration-200 ${
              isActive 
                ? 'bg-primary text-white shadow-sm ring-1 ring-primary/20' 
                : 'text-on-surface hover:text-secondary hover:bg-surface-container-low'
            }">
              <span>${isMl ? link.labelMl : link.labelEn}</span>
            </a>
          `;
        }).join('')}
      </nav>

      <!-- Action Buttons (Bilingual Toggle, Phone, WhatsApp, Admin) -->
      <div class="flex items-center gap-2 flex-shrink-0">
        <!-- Language Switcher Button -->
        <button 
          type="button" 
          onclick="if(window.i18n){window.i18n.toggleLang();}else if(window.toggleLanguage){window.toggleLanguage();}" 
          title="Switch Language / ഭാഷ മാറ്റുക" 
          class="lang-toggle-btn h-10 px-3 rounded-full bg-surface-container-low border border-outline-variant/50 flex items-center justify-center font-label-sm text-label-sm text-on-surface font-semibold hover:bg-surface-container hover:border-secondary transition-all shadow-xs"
        >
          ${isMl 
            ? '<span class="text-secondary font-bold">മല</span><span class="text-outline-variant px-0.5">|</span><span class="text-on-surface-variant font-medium">ENG</span>' 
            : '<span class="text-on-surface-variant font-medium">മല</span><span class="text-outline-variant px-0.5">|</span><span class="text-secondary font-bold">ENG</span>'}
        </button>

        <!-- Phone Button -->
        <a 
          href="tel:${getNexaContact().phoneCalling}" 
          aria-label="Direct Desk Call" 
          class="w-10 h-10 rounded-full bg-surface-container-low text-primary flex items-center justify-center hover:bg-surface-container hover:text-secondary active:scale-95 transition-all shadow-xs border border-outline-variant/30"
          title="Direct Phone Call: ${getNexaContact().phoneDisplay}"
        >
          <span class="material-symbols-outlined text-[20px]">call</span>
        </a>

        <!-- WhatsApp Enquiry Button -->
        <a 
          href="${getWhatsAppUrl('Hello Nexa Services, I need assistance with citizen services')}" 
          target="_blank" 
          rel="noopener noreferrer" 
          aria-label="WhatsApp Assistance" 
          class="relative w-10 h-10 rounded-full bg-gradient-to-tr from-[#002d27] to-[#0453cd] text-white flex items-center justify-center hover:opacity-95 active:scale-95 transition-all shadow-xs"
          title="WhatsApp Enquiry Desk (${getNexaContact().whatsappDisplay})"
        >
          <span class="material-symbols-outlined text-[20px] text-tertiary-fixed">chat</span>
          <span class="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-[#25d366] ring-2 ring-surface animate-pulse"></span>
        </a>

        <!-- Desktop Quick Apply CTA -->
        <a 
          href="${getWhatsAppUrl('Hello Nexa, I want to apply for a citizen service')}" 
          target="_blank" 
          rel="noopener noreferrer" 
          class="hidden lg:flex items-center gap-1.5 h-10 px-4 rounded-xl bg-gradient-to-r from-secondary to-[#0040a2] text-white font-label-md text-label-md font-bold shadow-sm hover:shadow-md hover:brightness-105 active:scale-95 transition-all"
        >
          <span class="material-symbols-outlined text-[18px]">send_to_mobile</span>
          <span>${isMl ? 'വാട്സാപ്പിൽ അപേക്ഷിക്കാം' : 'Apply via WhatsApp'}</span>
        </a>

        <!-- Operator / Staff Console Icon -->
        <a 
          href="login.html" 
          aria-label="Track / Admin Console" 
          class="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white hover:bg-secondary active:scale-95 transition-all shadow-xs"
          title="Track Status & Operator Desk"
        >
          <span class="material-symbols-outlined text-[18px]">person</span>
        </a>
      </div>
    </div>
  `;
}

/**
 * Render Mobile Bottom Navigation Bar (Matching Stitch design mobile dock)
 */
function renderMobileBottomNav(activePage = 'home') {
  const container = document.getElementById('app-bottom-nav');
  if (!container) return;

  const currentLang = window.i18n ? window.i18n.getLang() : (localStorage.getItem('nexa_lang') || 'ml');
  const isMl = currentLang === 'ml';

  const items = [
    { id: 'home', href: 'index.html', icon: 'cottage', labelEn: 'Home', labelMl: 'ഹോം' },
    { id: 'services', href: 'services.html', icon: 'apps', labelEn: 'Services', labelMl: 'സേവനങ്ങൾ' },
    { id: 'track', href: 'track.html', icon: 'published_with_changes', labelEn: 'Status', labelMl: 'സ്റ്റാറ്റസ്' },
    { id: 'about', href: 'about.html', icon: 'info', labelEn: 'About', labelMl: 'വിവരങ്ങൾ' },
    { id: 'contact', href: 'contact.html', icon: 'support_agent', labelEn: 'Help', labelMl: 'സഹായം' }
  ];

  container.innerHTML = `
    <nav class="md:hidden fixed bottom-0 left-0 right-0 z-50 pb-safe bg-surface/95 backdrop-blur-xl shadow-[0_-4px_20px_rgba(1,40,75,0.08)] border-t border-outline-variant/40">
      <div class="h-16 px-2 flex items-center justify-around">
        ${items.map(item => {
          const isActive = activePage === item.id;
          return `
            <a 
              href="${item.href}" 
              class="relative flex flex-col items-center justify-center min-w-[56px] min-h-[48px] py-1 transition-all duration-200 ${
                isActive 
                  ? 'text-secondary font-bold' 
                  : 'text-on-surface-variant hover:text-primary font-medium'
              }"
            >
              <div class="relative flex items-center justify-center">
                <span class="material-symbols-outlined text-[24px] ${isActive ? 'scale-110 text-secondary' : ''} transition-transform duration-200">${item.icon}</span>
                ${isActive ? '<span class="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-secondary"></span>' : ''}
              </div>
              <span class="font-label-sm text-label-sm mt-0.5 text-[11px] leading-tight tracking-tight">
                ${isMl ? item.labelMl : item.labelEn}
              </span>
            </a>
          `;
        }).join('')}
      </div>
    </nav>
  `;
}

/**
 * Render Comprehensive Footer with Malayalam/English disclaimers
 */
function renderFooter() {
  const container = document.getElementById('app-footer');
  if (!container) return;

  const currentLang = window.i18n ? window.i18n.getLang() : (localStorage.getItem('nexa_lang') || 'ml');
  const isMl = currentLang === 'ml';

  container.innerHTML = `
    <footer class="bg-gradient-to-b from-[#01284b] to-[#011a33] text-on-primary mt-12 pt-14 pb-24 md:pb-12 border-t border-primary-container relative overflow-hidden">
      <!-- Ambient subtle background glow -->
      <div class="absolute -top-32 left-1/2 -translate-x-1/2 w-96 h-96 bg-secondary/15 rounded-full blur-3xl pointer-events-none"></div>

      <div class="max-w-7xl mx-auto px-4 md:px-8 flex flex-col gap-10 relative z-10">
        <!-- Main Footer Columns -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <!-- Col 1: Identity -->
          <div class="flex flex-col gap-3.5">
            <div class="flex items-center gap-3">
              ${LOGO_SVG}
              <div class="flex flex-col">
                <span class="font-headline-sm text-headline-sm font-extrabold text-white leading-tight">Nexa Services</span>
                <span class="font-label-sm text-label-sm text-primary-fixed">നെക്സ ഡിജിറ്റൽ സർവീസസ്</span>
              </div>
            </div>
            <p class="font-body-sm text-body-sm text-on-primary-container leading-relaxed">
              ${isMl 
                ? '2018 മുതൽ കേരളത്തിലെ സാധാരണക്കാർക്ക് വിശ്വസനീയവും സുതാര്യവുമായ ഡിജിറ്റൽ സേവനങ്ങൾ നൽകിവരുന്ന സ്വതന്ത്ര പൗര സഹായ കേന്ദ്രം.' 
                : 'Providing Kerala citizens with trusted, prompt, and transparent digital application facilitation since 2018.'}
            </p>
            <div class="flex items-center gap-2 pt-2">
              <span class="px-3 py-1.5 rounded-full bg-primary-container/80 border border-primary-fixed/20 text-tertiary-fixed font-label-sm text-label-sm font-semibold flex items-center gap-2">
                <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                ${isMl ? 'സഹായ ഡെസ്ക് ഓൺലൈൻ' : 'Citizen Helpdesk Online'}
              </span>
            </div>
          </div>

          <!-- Col 2: Popular Services -->
          <div class="flex flex-col gap-3">
            <h4 class="font-label-lg text-label-lg font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <span class="w-1.5 h-3.5 rounded bg-secondary"></span>
              <span>${isMl ? 'പ്രധാന സേവനങ്ങൾ' : 'Top Services'}</span>
            </h4>
            <ul class="flex flex-col gap-2 font-body-sm text-body-sm text-on-primary-container">
              <li><a href="service-details.html?id=income-certificate" class="hover:text-white hover:translate-x-1 inline-block transition-all duration-200">വരുമാന സർട്ടിഫിക്കറ്റ് (Income Certificate)</a></li>
              <li><a href="service-details.html?id=pan-new" class="hover:text-white hover:translate-x-1 inline-block transition-all duration-200">പുതിയ പാൻ കാർഡ് (New PAN Card)</a></li>
              <li><a href="service-details.html?id=passport-fresh" class="hover:text-white hover:translate-x-1 inline-block transition-all duration-200">പാസ്‌പോർട്ട് സേവനങ്ങൾ (Passport Seva)</a></li>
              <li><a href="service-details.html?id=ration-card-service" class="hover:text-white hover:translate-x-1 inline-block transition-all duration-200">റേഷൻ കാർഡ് തിരുത്തൽ (Ration Card)</a></li>
              <li><a href="service-details.html?id=psc-registration" class="hover:text-white hover:translate-x-1 inline-block transition-all duration-200">PSC ഒറ്റത്തവണ രജിസ്ട്രേഷൻ (PSC OTR)</a></li>
              <li><a href="service-details.html?id=jeevan-pramaan" class="hover:text-white hover:translate-x-1 inline-block transition-all duration-200">ജീവൻ പ്രമാൺ (Digital Life Certificate)</a></li>
            </ul>
          </div>

          <!-- Col 3: Facilitation Centers -->
          <div class="flex flex-col gap-3">
            <h4 class="font-label-lg text-label-lg font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <span class="w-1.5 h-3.5 rounded bg-emerald-400"></span>
              <span>${isMl ? 'ഞങ്ങളുടെ കേന്ദ്രങ്ങൾ' : 'Facilitation Centers'}</span>
            </h4>
            <div class="flex flex-col gap-3 font-body-sm text-body-sm text-on-primary-container">
              <div class="flex items-start gap-2.5 bg-primary-container/40 p-2.5 rounded-xl border border-white/5">
                <span class="material-symbols-outlined text-secondary-fixed text-[18px] mt-0.5">location_on</span>
                <div>
                  <strong class="text-white block font-medium">Kakkanad HQ (Ernakulam):</strong>
                  Near Civil Station Road, Kakkanad, Ernakulam - 682030
                </div>
              </div>
              <div class="flex items-start gap-2.5 bg-primary-container/40 p-2.5 rounded-xl border border-white/5">
                <span class="material-symbols-outlined text-secondary-fixed text-[18px] mt-0.5">location_on</span>
                <div>
                  <strong class="text-white block font-medium">Palakkad Branch:</strong>
                  Stadium Junction, Near Municipal Bus Stand - 678001
                </div>
              </div>
              <div class="flex items-start gap-2.5 text-xs">
                <span class="material-symbols-outlined text-emerald-300 text-[18px] mt-0.5">schedule</span>
                <div>
                  <span class="text-white font-semibold">തിങ്കൾ – ശനി:</span> 8:30 AM – 7:30 PM<br>
                  <span class="text-white font-semibold">ഞായർ:</span> 10:00 AM – 2:00 PM (WhatsApp)
                </div>
              </div>
            </div>
          </div>

          <!-- Col 4: Direct Help Desks -->
          <div class="flex flex-col gap-3">
            <h4 class="font-label-lg text-label-lg font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <span class="w-1.5 h-3.5 rounded bg-tertiary-fixed"></span>
              <span>${isMl ? 'നേരിട്ട് വിളിക്കാം' : 'Direct Support'}</span>
            </h4>
            <div class="flex flex-col gap-2.5">
              <a href="https://wa.me/918086380373" target="_blank" rel="noopener noreferrer" class="p-3 rounded-xl bg-gradient-to-r from-[#00453d] to-[#002d27] hover:brightness-110 text-white flex items-center gap-3 transition-all border border-emerald-500/20 shadow-xs">
                <span class="material-symbols-outlined text-emerald-400 text-[24px]">chat</span>
                <div class="flex flex-col leading-tight">
                  <span class="font-label-lg text-label-lg font-bold">+91 8086380373</span>
                  <span class="font-label-sm text-label-sm text-emerald-200">WhatsApp Helpdesk</span>
                </div>
              </a>
              <a href="tel:+914842987654" class="p-3 rounded-xl bg-primary-container/80 hover:bg-primary-container text-white flex items-center gap-3 transition-colors border border-white/5">
                <span class="material-symbols-outlined text-secondary-fixed text-[24px]">call</span>
                <div class="flex flex-col leading-tight">
                  <span class="font-label-lg text-label-lg font-bold">0484 2987654</span>
                  <span class="font-label-sm text-label-sm text-primary-fixed">Kakkanad Landline</span>
                </div>
              </a>
              <a href="mailto:help@nexadigital.in" class="p-3 rounded-xl bg-primary-container/80 hover:bg-primary-container text-white flex items-center gap-3 transition-colors border border-white/5">
                <span class="material-symbols-outlined text-secondary-fixed text-[24px]">mail</span>
                <div class="flex flex-col leading-tight">
                  <span class="font-label-lg text-label-lg font-bold truncate">help@nexadigital.in</span>
                  <span class="font-label-sm text-label-sm text-primary-fixed">Official Electronic Mail</span>
                </div>
              </a>
            </div>
          </div>
        </div>

        <!-- Statutory Citizen Notice Box (Required by Stitch Design System) -->
        <div class="bg-primary-container/80 rounded-2xl p-5 border border-primary-fixed/20 flex flex-col gap-3 shadow-inner">
          <div class="flex items-center gap-2 text-primary-fixed font-bold font-label-lg text-label-lg">
            <span class="material-symbols-outlined text-[20px] text-emerald-300">policy</span>
            <span>Statutory Citizen Notice & Independence Declaration • നിയമപരമായ നിരാകരണ പ്രസ്താവന</span>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-on-primary-container font-body-sm text-body-sm leading-relaxed">
            <p>
              <strong>English:</strong> Nexa Digital Services is an authorized independent citizen facilitation center. We assist citizens with online filing, document scanning, formatting, and tracking. We do not represent any government Ministry or department. Statutory application fees are paid directly to designated state and central portals.
            </p>
            <p>
              <strong>മലയാളം:</strong> നെക്സ ഡിജിറ്റൽ സർവീസസ് ഒരു സ്വകാര്യ ഓൺലൈൻ സേവന സഹായ കേന്ദ്രമാണ്. സർക്കാർ അപേക്ഷകൾ സമർപ്പിക്കുന്നതിനും സ്കാനിംഗ്, ഫോർമാറ്റിംഗ് തുടങ്ങിയ സാങ്കേതിക സഹായങ്ങൾക്കുമായി മാത്രം സർവീസ് ചാർജ് ഈടാക്കുന്നു. സർക്കാർ നിശ്ചയിച്ച ഫീസുകൾ അതത് ഔദ്യോഗിക പോർട്ടലുകളിലേക്ക് നേരിട്ട് കൈമാറപ്പെടുന്നു.
            </p>
          </div>
        </div>

        <!-- Bottom Copyright & Badges -->
        <div class="pt-4 border-t border-primary-container/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left text-on-primary-container font-body-sm text-[13px]">
          <div>
            © 2026 Nexa Digital Services. All rights reserved. Independent Citizen Service Kiosk.
          </div>
          <div class="flex items-center gap-4 flex-wrap justify-center">
            <a href="about.html" class="hover:text-white transition-colors">About Us</a>
            <span>•</span>
            <a href="contact.html" class="hover:text-white transition-colors">Contact</a>
            <span>•</span>
            <a href="track.html" class="hover:text-white transition-colors">Track Status</a>
            <span>•</span>
            <a href="chatbot.html" class="hover:text-white transition-colors font-bold text-emerald-300">NEXA AI Desk</a>
            <span>•</span>
            <a href="admin.html" class="hover:text-white transition-colors text-blue-200">Admin Portal</a>
          </div>
        </div>
      </div>
    </footer>
  `;
}

/**
 * Render Floating WhatsApp Trigger (Corner quick assistance with ping)
 */
function renderFloatingWhatsApp() {
  if (document.getElementById('floating-whatsapp-btn')) return;

  const btn = document.createElement('a');
  btn.id = 'floating-whatsapp-btn';
  btn.href = getWhatsAppUrl('Hello Nexa Services, I need quick assistance with an online application');
  btn.target = '_blank';
  btn.rel = 'noopener noreferrer';
  btn.setAttribute('aria-label', 'Chat with Nexa WhatsApp Desk');
  btn.className = 'fixed left-4 bottom-20 md:bottom-8 z-40 bg-[#128C7E] hover:bg-[#075E54] text-white p-3.5 rounded-full shadow-2xl flex items-center gap-2.5 transition-all duration-300 active:scale-95 group whatsapp-pulse hover:shadow-[0_8px_25px_rgba(37,211,102,0.4)]';

  btn.innerHTML = `
    <div class="relative flex items-center justify-center">
      <svg class="w-6 h-6 fill-current" viewBox="0 0 24 24">
        <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86.173.086.275.072.376-.044.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.043.072.043.419-.101.824z"/>
      </svg>
      <span class="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-[#25D366] border-2 border-white animate-ping"></span>
    </div>
    <span class="hidden md:inline-block font-label-md text-label-md font-bold pr-1">
      WhatsApp Desk
    </span>
  `;

  document.body.appendChild(btn);
}

/**
 * Toast Notification Helper
 */
function showToast(message, type = 'success') {
  let toast = document.getElementById('nexa-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'nexa-toast';
    toast.className = 'fixed top-24 right-4 z-50 max-w-sm px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 transition-all transform duration-300 pointer-events-none translate-y-[-20px] opacity-0 backdrop-blur-md';
    document.body.appendChild(toast);
  }

  const isSuccess = type === 'success';
  toast.className = `fixed top-24 right-4 z-50 max-w-sm px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 transition-all transform duration-300 pointer-events-auto backdrop-blur-md ${
    isSuccess ? 'bg-[#01284b]/95 text-white border border-emerald-500/30' : 'bg-[#0453cd]/95 text-white border border-white/20'
  }`;

  toast.innerHTML = `
    <span class="material-symbols-outlined text-[22px] ${isSuccess ? 'text-emerald-400' : 'text-white'}">
      ${isSuccess ? 'check_circle' : 'info'}
    </span>
    <span class="font-body-sm text-body-sm font-medium leading-snug">${message}</span>
  `;

  requestAnimationFrame(() => {
    toast.classList.remove('translate-y-[-20px]', 'opacity-0');
    toast.classList.add('translate-y-0', 'opacity-100');
  });

  setTimeout(() => {
    toast.classList.remove('translate-y-0', 'opacity-100');
    toast.classList.add('translate-y-[-20px]', 'opacity-0');
  }, 3500);
}

/**
 * Native Scroll Reveal Animation Initializer
 * Uses IntersectionObserver - Zero external libraries required
 */
function initScrollReveal() {
  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('active'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.08,
    rootMargin: '0px 0px -30px 0px'
  });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

// Helper to get contact config
function getNexaContact() {
  if (window.NEXA_CONFIG && window.NEXA_CONFIG.contact) {
    return window.NEXA_CONFIG.contact;
  }
  return {
    whatsappNumber: "919447012345",
    whatsappDisplay: "+91 94470 12345",
    phoneCalling: "+919447012345",
    phoneDisplay: "+91 94470 12345"
  };
}

function getWhatsAppUrl(msg = "Hello Nexa Services, I need assistance with citizen services.") {
  const contact = getNexaContact();
  return `https://wa.me/${contact.whatsappNumber}?text=${encodeURIComponent(msg)}`;
}

/**
 * Auto-inject NEXA AI Assistant Widget across all pages
 */
function loadNexaAiChatbotWidget() {
  if (document.getElementById('nexa-chatbot-widget-script')) return;

  if (!document.getElementById('nexa-chatbot-widget-css')) {
    const css = document.createElement('link');
    css.id = 'nexa-chatbot-widget-css';
    css.rel = 'stylesheet';
    css.href = 'dist-client/nexa-chatbot.css';
    document.head.appendChild(css);
  }

  const script = document.createElement('script');
  script.id = 'nexa-chatbot-widget-script';
  script.type = 'module';
  script.src = 'dist-client/nexa-chatbot.js';
  document.body.appendChild(script);
}

// Automatically initialize components on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  renderFloatingWhatsApp();
  loadNexaAiChatbotWidget();
  initScrollReveal();

  const activePage = document.body.getAttribute('data-page') || 'home';
  if (document.getElementById('app-header')) renderHeader(activePage);
  if (document.getElementById('app-bottom-nav')) renderMobileBottomNav(activePage);
  if (document.getElementById('app-footer')) renderFooter();
});

// React to language switch events across pages
window.addEventListener('languageChanged', (e) => {
  const activePage = document.body.getAttribute('data-page') || 'home';
  if (document.getElementById('app-header')) renderHeader(activePage);
  if (document.getElementById('app-bottom-nav')) renderMobileBottomNav(activePage);
  if (document.getElementById('app-footer')) renderFooter();
});

// Register PWA Service Worker
if ('serviceWorker' in navigator && (window.location.protocol === 'http:' || window.location.protocol === 'https:')) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').then((reg) => {
      console.log('Nexa PWA ServiceWorker registered with scope:', reg.scope);
    }).catch((err) => {
      console.log('ServiceWorker registration skipped/failed:', err);
    });
  });
}
