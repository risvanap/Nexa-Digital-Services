/**
 * Nexa Digital Services - Central Configuration File
 * Edit your center phone numbers, WhatsApp, addresses, and hours in ONE place here.
 */

window.NEXA_CONFIG = {
  // Brand & Identity
  brand: {
    nameEn: "Nexa Digital Services",
    nameMl: "നെക്സ ഡിജിറ്റൽ സർവീസസ്",
    taglineEn: "Independent Citizen Digital Services Center • Kerala",
    taglineMl: "സ്വതന്ത്ര പൗര ഡിജിറ്റൽ സേവന കേന്ദ്രം • കേരളം",
    subtitleEn: "Kerala Citizen Facilitation Center",
    subtitleMl: "പൗര സേവന കേന്ദ്രം",
    type: "Akshaya / CSC-style Independent Citizen Facilitation Kiosk"
  },

  // Contact Desks
  contact: {
    // Primary WhatsApp Business Number (Digits only with country code, no + or spaces)
    whatsappNumber: "918086380373",
    whatsappDisplay: "+91 8086380373",
    
    // Primary Calling Number
    phoneCalling: "+918086380373",
    phoneDisplay: "+91 8086380373",

    // Alternate Support Desk Number
    altPhoneCalling: "+918086380373",
    altPhoneDisplay: "+91 8086380373",

    // Email
    email: "helpdesk@nexadigitalservices.in",
    
    // Default pre-filled message for WhatsApp
    defaultMessage: "Hello Nexa Services, I need assistance with citizen services."
  },

  // Physical Branch Locations
  branches: [
    {
      id: "kakkanad",
      nameEn: "Kakkanad Main Hub",
      nameMl: "കാക്കനാട് മെയിൻ കേന്ദ്രം",
      type: "Main Operational Hub",
      addressEn: "Civil Station Road, Near Collectorate Signal, Kakkanad, Ernakulam, Kerala - 682030",
      addressMl: "സിവിൽ സ്റ്റേഷൻ റോഡ്, കളക്ടറേറ്റ് സിഗ്നലിന് സമീപം, കാക്കനാട്, എറണാകുളം - 682030",
      phone: "+91 94470 12345",
      phoneRaw: "+919447012345",
      email: "kakkanad@nexadigitalservices.in",
      hoursEn: "Mon – Sat: 8:30 AM – 7:30 PM | Sun: 9:30 AM – 1:30 PM",
      hoursMl: "തിങ്കൾ – ശനി: 8:30 AM – 7:30 PM | ഞായർ: 9:30 AM – 1:30 PM",
      mapsUrl: "https://maps.google.com/?q=Kakkanad+Civil+Station+Kochi"
    },
    {
      id: "palakkad",
      nameEn: "Palakkad City Branch",
      nameMl: "പാലക്കാട് സിറ്റി ബ്രാഞ്ച്",
      type: "District Extension Kiosk",
      addressEn: "Opp. Town Railway Station Gate, Fort Maidan Road, Palakkad, Kerala - 678001",
      addressMl: "ടൗൺ റെയിൽവേ സ്റ്റേഷൻ ഗേറ്റിന് എതിർവശം, കോട്ട മൈതാനം റോഡ്, പാലക്കാട് - 678001",
      phone: "+91 94470 54321",
      phoneRaw: "+919447054321",
      email: "palakkad@nexadigitalservices.in",
      hoursEn: "Mon – Sat: 9:00 AM – 7:00 PM | Sun: Closed",
      hoursMl: "തിങ്കൾ – ശനി: 9:00 AM – 7:00 PM | ഞായർ: അവധി",
      mapsUrl: "https://maps.google.com/?q=Palakkad+Town+Railway+Station"
    }
  ],

  // Working Hours (General)
  timings: {
    weekdays: "8:30 AM – 7:30 PM",
    sunday: "9:30 AM – 1:30 PM",
    lunchBreak: "No break (Continuous counter service)"
  },

  // Master Service Fees Schedule (Govt statutory fee + Center consultation fee)
  fees: {
    "income-certificate": { govtFee: 25, serviceFee: 30, totalFee: 55, labelEn: "Income Certificate", labelMl: "വരുമാന സർട്ടിഫിക്കറ്റ്" },
    "caste-certificate": { govtFee: 25, serviceFee: 30, totalFee: 55, labelEn: "Caste Certificate", labelMl: "ജാതി സർട്ടിഫിക്കറ്റ്" },
    "pan-new": { govtFee: 107, serviceFee: 60, totalFee: 167, labelEn: "New PAN Card", labelMl: "പുതിയ പാൻ കാർഡ്" },
    "pan-correction": { govtFee: 107, serviceFee: 80, totalFee: 187, labelEn: "PAN Correction", labelMl: "പാൻ തിരുത്തൽ" },
    "passport-fresh": { govtFee: 1500, serviceFee: 150, totalFee: 1650, labelEn: "Fresh Passport Slot", labelMl: "പാസ്‌പോർട്ട് സ്ലോട്ട്" },
    "ration-card-service": { govtFee: 0, serviceFee: 50, totalFee: 50, labelEn: "Ration Card Addition", labelMl: "റേഷൻ കാർഡ് തിരുത്തൽ" },
    "psc-registration": { govtFee: 0, serviceFee: 40, totalFee: 40, labelEn: "Kerala PSC OTR", labelMl: "PSC രജിസ്ട്രേഷൻ" },
    "jeevan-pramaan": { govtFee: 0, serviceFee: 30, totalFee: 30, labelEn: "Digital Life Certificate", labelMl: "ജീവൻ പ്രമാൺ" },
    "vahan-road-tax": { govtFee: 0, serviceFee: 40, totalFee: 40, labelEn: "Road Tax Payment", labelMl: "വാഹന നികുതി" },
    "printing-scanning": { govtFee: 0, serviceFee: 10, totalFee: 10, labelEn: "Printing & Scanning", labelMl: "പ്രിന്റിംഗ് & സ്കാനിംഗ്" }
  },

  // Payment UPI / Counter Instructions
  payment: {
    upiId: "nexaservices@upi",
    acceptedModes: "Cash, Google Pay, PhonePe, Paytm, BHIM UPI, Debit Card"
  },

  // Legal & Disclaimer
  disclaimer: {
    textEn: "Nexa Digital Services is an independent citizen facilitation kiosk assisting the public with online applications, document digitization, and portal navigation. We are an authorized digital services provider and not a government department.",
    textMl: "നെക്സ ഡിജിറ്റൽ സർവീസസ് എന്നത് സർക്കാർ സേവനങ്ങൾ പൊതുജനങ്ങൾക്ക് വേഗത്തിൽ ലഭ്യമാക്കുന്ന ഒരു സ്വതന്ത്ര പൗര സേവന കേന്ദ്രമാണ് (Akshaya/CSC ശൈലി). ഞങ്ങൾ സർക്കാർ വകുപ്പല്ല."
  }
};

