import { Language } from '../types';

export const WELCOME_MESSAGES: Record<Language, string> = {
  ml: `നമസ്കാരം! 👋\n\nNEXA DIGITAL SERVICES-ലേക്ക് സ്വാഗതം.\n\nനിങ്ങളുടെ സർക്കാർ ഓൺലൈൻ അപേക്ഷകൾക്കും മറ്റ് ഡിജിറ്റൽ സേവനങ്ങൾക്കും സഹായിക്കാൻ ഞങ്ങളുടെ AI Assistant തയ്യാറാണ്.\n\nനിങ്ങൾക്ക് എന്ത് സേവനമാണ് ആവശ്യമുള്ളത്?`,
  en: `Hello! 👋\n\nWelcome to NEXA DIGITAL SERVICES.\n\nI'm your AI Digital Service Assistant.\n\nI can help you with government applications, registrations, certificates, education services, vehicle services and many more digital services.\n\nHow can I help you today?`
};

export const UI_TEXT = {
  ml: {
    brandName: 'NEXA AI',
    subtitle: 'നിങ്ങളുടെ ഡിജിറ്റൽ സർവീസ് അസിസ്റ്റന്റ്',
    online: 'ഓൺലൈൻ',
    inputPlaceholder: 'നിങ്ങളുടെ ചോദ്യം ഇവിടെ ചോദിക്കുക... (ഉദാ: പാസ്പോർട്ട്, റേഷൻ കാർഡ്)',
    send: 'അയക്കുക',
    suggestedServices: 'പ്രധാന സേവനങ്ങൾ',
    whatsappSupport: 'വാട്സാപ്പ് ഹെൽപ്പ് ഡെസ്ക്',
    applyNow: 'അപേക്ഷ സമർപ്പിക്കുക',
    viewDocuments: 'ആവശ്യമായ രേഖകൾ',
    govtFee: 'സർക്കാർ ഫീസ്',
    nexaFee: 'നെക്സ ചാർജ്ജ്',
    procedure: 'അപേക്ഷാ രീതി',
    clearChat: 'സംഭാഷണം ക്ലിയർ ചെയ്യുക',
    enquiryTitle: 'അപേക്ഷാ അന്വേഷണം സമർപ്പിക്കുക',
    nameLabel: 'നിങ്ങളുടെ പേര്',
    phoneLabel: 'മൊബൈൽ നമ്പർ (10 അക്കങ്ങൾ)',
    serviceLabel: 'സേവനം',
    applicationTypeLabel: 'പ്രത്യേക അപേക്ഷാരീതി',
    detailsLabel: 'വിവരണം (ഓപ്ഷണൽ)',
    submitEnquiry: 'അന്വേഷണം സമർപ്പിക്കുക',
    enquirySuccess: 'നിങ്ങളുടെ അന്വേഷണം വിജയകരമായി രജിസ്റ്റർ ചെയ്തു!',
    refNumber: 'അന്വേഷണ നമ്പർ',
    openWhatsApp: 'വാട്സാപ്പിൽ സന്ദേശം അയക്കുക',
    close: 'അടയ്ക്കുക',
    disclaimer: 'NEXA DIGITAL SERVICES ഒരു സ്വതന്ത്ര പൗര സേവന കേന്ദ്രമാണ്. ഞങ്ങൾ സർക്കാർ ഓഫീസല്ല.',
    aadhaarNotice: 'ശ്രദ്ധിക്കുക: പുതിയ ആധാർ എൻറോൾമെന്റും ബയോമെട്രിക് അപ്ഡേറ്റുകളും ഔദ്യോഗിക UIDAI കേന്ദ്രങ്ങളിൽ മാത്രമേ ലഭ്യമാകൂ.'
  },
  en: {
    brandName: 'NEXA AI',
    subtitle: 'Your Digital Service Assistant',
    online: 'Online',
    inputPlaceholder: 'Ask anything... (e.g., Passport, PAN card, Ration card)',
    send: 'Send',
    suggestedServices: 'Popular Services',
    whatsappSupport: 'WhatsApp Helpdesk',
    applyNow: 'Apply Now / Enquiry',
    viewDocuments: 'Required Documents',
    govtFee: 'Official Govt Fee',
    nexaFee: 'Nexa Service Charge',
    procedure: 'Application Procedure',
    clearChat: 'Clear Conversation',
    enquiryTitle: 'Submit Customer Enquiry',
    nameLabel: 'Your Full Name',
    phoneLabel: 'Mobile Number (10 digits)',
    serviceLabel: 'Selected Service',
    applicationTypeLabel: 'Specific Application Type',
    detailsLabel: 'Additional Details (Optional)',
    submitEnquiry: 'Confirm & Submit Enquiry',
    enquirySuccess: 'Your enquiry has been successfully registered!',
    refNumber: 'Enquiry Reference',
    openWhatsApp: 'Connect on WhatsApp',
    close: 'Close',
    disclaimer: 'Nexa Digital Services is an independent citizen facilitation centre. We are not a government department.',
    aadhaarNotice: 'Notice: New Aadhaar enrolments and biometric updates are strictly conducted at official UIDAI centres only.'
  }
};
