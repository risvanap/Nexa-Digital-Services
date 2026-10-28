/**
 * Nexa Digital Services - Master Services Catalog
 * Real-world Akshaya / CSC Citizen Facilitation Services for Kerala
 */

const SERVICES_DATA = [
  {
    id: "income-certificate",
    category: "certificates",
    categoryLabelEn: "Revenue Certificates",
    categoryLabelMl: "റവന്യൂ സർട്ടിഫിക്കറ്റുകൾ",
    icon: "account_balance",
    titleEn: "Income Certificate",
    titleMl: "വരുമാന സർട്ടിഫിക്കറ്റ്",
    portalEn: "e-District Kerala Revenue Portal",
    portalMl: "ഇ-ഡിസ്ട്രിക്ട് കേരള റവന്യൂ പോർട്ടൽ",
    shortDescEn: "Official annual household income verification for scholarships, fee concessions, and government welfare benefits.",
    shortDescMl: "വിദ്യാഭ്യാസ സ്കോളർഷിപ്പ്, ഫീസ് ഇളവ്, ക്ഷേമ പെൻഷൻ എന്നിവയ്ക്കുള്ള ഔദ്യോഗിക വാർഷിക വരുമാന സർട്ടിഫിക്കറ്റ്.",
    govtFee: 25,
    serviceFee: 30,
    totalFee: 55,
    deliveryDaysEn: "3–5 Working Days",
    deliveryDaysMl: "3-5 പ്രവൃത്തിദിനങ്ങൾ",
    validityEn: "6 Months",
    validityMl: "6 മാസം",
    issuingBodyEn: "Village Officer / Tahsildar",
    issuingBodyMl: "വില്ലേജ് ഓഫീസർ / തഹസിൽദാർ",
    isPopular: true,
    badgeEn: "Most Requested",
    badgeMl: "കൂടുതൽ ആവശ്യപ്പെടുന്നത്",
    requiredDocs: [
      {
        id: "doc-income",
        titleEn: "Income Proof Document",
        titleMl: "വരുമാനം തെളിയിക്കുന്ന രേഖ",
        descEn: "Salary Certificate from employer / Pension Passbook / Latest IT Return / Bank Statement",
        descMl: "ശമ്പള സർട്ടിഫിക്കറ്റ് / പെൻഷൻ പാസ്ബുക്ക് / ബാങ്ക് സ്റ്റേറ്റ്‌മെന്റ്",
        mandatory: true
      },
      {
        id: "doc-ration",
        titleEn: "Ration Card Copy",
        titleMl: "റേഷൻ കാർഡ് പകർപ്പ്",
        descEn: "First page & family members details page",
        descMl: "ആദ്യ പേജും കുടുംബാംഗങ്ങളുടെ വിവരങ്ങൾ ഉള്ള പേജും",
        mandatory: true
      },
      {
        id: "doc-aadhaar",
        titleEn: "Aadhaar Card of Applicant",
        titleMl: "അപേക്ഷകന്റെ ആധാർ കാർഡ്",
        descEn: "With active mobile number linked for OTP",
        descMl: "മൊബൈൽ നമ്പർ ലിങ്ക് ചെയ്ത ആധാർ കാർഡ്",
        mandatory: true
      },
      {
        id: "doc-landtax",
        titleEn: "Current Land Tax Receipt",
        titleMl: "നടപ്പുവർഷത്തെ ഭൂനികുതി രസീത്",
        descEn: "Kandamazhukku / Thandapper tax receipt (if land is owned)",
        descMl: "നടപ്പു വർഷത്തെ കരം ഒടുക്കിയ രസീത്",
        mandatory: false
      },
      {
        id: "doc-photo",
        titleEn: "Passport Size Photograph",
        titleMl: "പാസ്‌പോർട്ട് സൈസ് ഫോട്ടോ",
        descEn: "Recent clear photograph with light background",
        descMl: "വെള്ള പശ്ചാത്തലത്തിലുള്ള പുതിയ ഫോട്ടോ",
        mandatory: true
      }
    ],
    stepsEn: [
      { num: 1, title: "Eligibility & Document Scrutiny", desc: "Our operator checks salary slips, ration card categories, and address consistency before portal entry." },
      { num: 2, title: "e-District Portal Upload & Acknowledgement", desc: "Submitted directly to Kerala Revenue gateway. You get an immediate SMS with the Govt Application Reference Number." },
      { num: 3, title: "Village Office Field Tracking", desc: "Nexa tracks your file's desk status at the local Village Office to ensure timely field verification." },
      { num: 4, title: "Digitally Signed Certificate Delivery", desc: "Receive the QR-coded, digitally signed certificate on WhatsApp/SMS or collect high-gsm print at our center." }
    ],
    stepsMl: [
      { num: 1, title: "രേഖകളുടെ പരിശോധന", desc: "ശമ്പള സർട്ടിഫിക്കറ്റും റേഷൻ കാർഡും കൃത്യമായി പരിശോധിച്ച് റിജക്ഷൻ ഒഴിവാക്കുന്നു." },
      { num: 2, title: "പോർട്ടലിൽ സമർപ്പിക്കൽ", desc: "ഇ-ഡിസ്ട്രിക്ട് പോർട്ടലിൽ അപേക്ഷ സമർപ്പിച്ച് ഉടൻ തന്നെ അക്നോളജ്മെന്റ് നമ്പർ SMS ആയി നൽകുന്നു." },
      { num: 3, title: "വില്ലേജ് ഓഫീസ് ട്രാക്കിംഗ്", desc: "വില്ലേജ് ഓഫീസറുടെയും റവന്യൂ ഉദ്യോഗസ്ഥരുടെയും അനുമതിക്കായി ഫയൽ നിരന്തരം ഫോളോ-അപ്പ് ചെയ്യുന്നു." },
      { num: 4, title: "സർട്ടിഫിക്കറ്റ് വിതരണം", desc: "ഡിജിറ്റൽ ഒപ്പോടു കൂടിയ ഒറിജിനൽ സർട്ടിഫിക്കറ്റ് വാട്സാപ്പിൽ അല്ലെങ്കിൽ നേരിട്ട് ലഭ്യമാക്കുന്നു." }
    ]
  },
  {
    id: "caste-certificate",
    category: "certificates",
    categoryLabelEn: "Revenue Certificates",
    categoryLabelMl: "റവന്യൂ സർട്ടിഫിക്കറ്റുകൾ",
    icon: "badge",
    titleEn: "Community / Caste Certificate",
    titleMl: "ജാതി സർട്ടിഫിക്കറ്റ്",
    portalEn: "e-District Kerala Revenue Portal",
    portalMl: "ഇ-ഡിസ്ട്രിക്ട് കേരള റവന്യൂ പോർട്ടൽ",
    shortDescEn: "Community and caste certificate issuance for education reservations, government recruitments and PSC applications.",
    shortDescMl: "വിദ്യാഭ്യാസ സംവരണം, സർക്കാർ ജോലികൾ, PSC പരീക്ഷകൾ എന്നിവയ്ക്കുള്ള കമ്മ്യൂണിറ്റി / ജാതി സർട്ടിഫിക്കറ്റ്.",
    govtFee: 25,
    serviceFee: 30,
    totalFee: 55,
    deliveryDaysEn: "3–7 Working Days",
    deliveryDaysMl: "3-7 പ്രവൃത്തിദിനങ്ങൾ",
    validityEn: "3 Years",
    validityMl: "3 വർഷം",
    issuingBodyEn: "Tahsildar / Village Officer",
    issuingBodyMl: "തഹസിൽദാർ / വില്ലേജ് ഓഫീസർ",
    isPopular: true,
    badgeEn: "Government Verified",
    badgeMl: "ഗവണ്മെന്റ് അംഗീകൃതം",
    requiredDocs: [
      { id: "caste-sslc", titleEn: "SSLC / School Certificate with Caste Entry", titleMl: "ജാതി രേഖപ്പെടുത്തിയ SSLC ബുക്ക്", descEn: "Applicant's or parents' educational record", descMl: "അപേക്ഷകന്റെയോ മാതാപിതാക്കളുടെയോ സ്കൂൾ രേഖ", mandatory: true },
      { id: "caste-ration", titleEn: "Ration Card Copy", titleMl: "റേഷൻ കാർഡ് പകർപ്പ്", descEn: "Family proof", descMl: "കുടുംബ വിവരങ്ങൾ അടങ്ങിയ പേജ്", mandatory: true },
      { id: "caste-aadhaar", titleEn: "Aadhaar Card", titleMl: "ആധാർ കാർഡ്", descEn: "Identity verification", descMl: "തിരിച്ചറിയൽ രേഖ", mandatory: true }
    ],
    stepsEn: [
      { num: 1, title: "Verification of SSLC Record", desc: "Checking school records and caste entry consistency." },
      { num: 2, title: "e-District Submission", desc: "Online submission to the Taluk / Revenue office." },
      { num: 3, title: "Taluk Office Clearance", desc: "Verification and digital signing by the Revenue Inspector/Tahsildar." },
      { num: 4, title: "Final Certificate Issue", desc: "Delivered via WhatsApp PDF and center printed copy." }
    ],
    stepsMl: [
      { num: 1, title: "സ്കൂൾ രേഖകളുടെ പരിശോധന", desc: "SSLC ബുക്കിലെ ജാതി വിവരങ്ങൾ ഒത്തുനോക്കുന്നു." },
      { num: 2, title: "ഇ-ഡിസ്ട്രിക്ട് അപേക്ഷ", desc: "താലൂക്ക് / റവന്യൂ ഓഫീസിലേക്ക് ഓൺലൈൻ അപേക്ഷ സമർപ്പിക്കുന്നു." },
      { num: 3, title: "താലൂക്ക് ഓഫീസ് പരിശോധന", desc: "റവന്യൂ ഇൻസ്‌പെക്ടറുടെ പരിശോധനയ്ക്ക് ശേഷം അംഗീകാരം." },
      { num: 4, title: "സർട്ടിഫിക്കറ്റ് വിതരണം", desc: "വാട്സാപ്പിലും സെന്ററിലും ഡിജിറ്റൽ സർട്ടിഫിക്കറ്റ് ലഭ്യമാക്കുന്നു." }
    ]
  },
  {
    id: "pan-new",
    category: "pan",
    categoryLabelEn: "PAN Services",
    categoryLabelMl: "പാൻ കാർഡ് സേവനങ്ങൾ",
    icon: "contact_emergency",
    titleEn: "New PAN Card (Instant e-PAN & Physical)",
    titleMl: "പുതിയ പാൻ കാർഡ്",
    portalEn: "NSDL / UTIITSL Portal",
    portalMl: "NSDL / UTIITSL പോർട്ടൽ",
    shortDescEn: "Instant e-PAN delivery within 48 hours and high-durability plastic PVC card delivered to doorstep via Speed Post.",
    shortDescMl: "48 മണിക്കൂറിനുള്ളിൽ e-PAN കാർഡും സ്പീഡ് പോസ്റ്റ് വഴി വീട്ടിലെത്തുന്ന ഒറിജിനൽ പ്ലാസ്റ്റിക് ഫിസിക്കൽ കാർഡും.",
    govtFee: 107,
    serviceFee: 60,
    totalFee: 167,
    deliveryDaysEn: "e-PAN: 48h | Card: 7–10 Days",
    deliveryDaysMl: "e-PAN: 48 മണിക്കൂർ | കാർഡ്: 7-10 ദിവസം",
    validityEn: "Lifetime",
    validityMl: "ആജീവനാന്തം",
    issuingBodyEn: "Income Tax Department, Govt of India",
    issuingBodyMl: "ഇൻകം ടാക്സ് ഡിപ്പാർട്ട്മെന്റ് (ഭാരത സർക്കാർ)",
    isPopular: true,
    badgeEn: "Doorstep Delivery",
    badgeMl: "വീട്ടിലെത്തും",
    requiredDocs: [
      { id: "pan-aadhaar", titleEn: "Aadhaar Card", titleMl: "ആധാർ കാർഡ്", descEn: "With linked mobile for Aadhaar OTP authentication", descMl: "OTP ലഭ്യമാകുന്ന മൊബൈൽ നമ്പർ ലിങ്ക് ചെയ്ത ആധാർ", mandatory: true },
      { id: "pan-photo", titleEn: "Passport Size Photograph", titleMl: "പാസ്‌പോർട്ട് ഫോട്ടോ", descEn: "2 Recent color photos (or digital camera snap)", descMl: "വെള്ള പശ്ചാത്തലത്തിലുള്ള 2 ഫോട്ടോ", mandatory: true },
      { id: "pan-sign", titleEn: "Signature on Plain White Paper", titleMl: "വെള്ള പേപ്പറിൽ ഒപ്പ്", descEn: "Clear black ink signature", descMl: "കറുത്ത മഷിയിൽ ഇട്ട വ്യക്തമായ ഒപ്പ്", mandatory: true }
    ],
    stepsEn: [
      { num: 1, title: "Instant e-KYC Verification", desc: "Biometric or OTP based Aadhaar matching for error-free name and DOB." },
      { num: 2, title: "NSDL Gateway Filing", desc: "Filing Form 49A with instant official acknowledgement number." },
      { num: 3, title: "e-PAN Generation", desc: "PDF PAN generated and sent directly to your WhatsApp in 48 hours." },
      { num: 4, title: "Speed Post Tracking", desc: "India Post consignment tracking number provided until PVC card arrives." }
    ],
    stepsMl: [
      { num: 1, title: "ആധാർ വെരിഫിക്കേഷൻ", desc: "ആധാർ ലിങ്ക് ചെയ്ത മൊബൈൽ വഴി തൽസമയ OTP പരിശോധന." },
      { num: 2, title: "പോർട്ടൽ അപേക്ഷ സമർപ്പണം", desc: "Form 49A ഫയൽ ചെയ്ത് തൽസമയം അക്നോളജ്മെന്റ് സ്ലിപ്പ് നൽകുന്നു." },
      { num: 3, title: "e-PAN ലഭ്യമാക്കൽ", desc: "48 മണിക്കൂറിനുള്ളിൽ ഒഫീഷ്യൽ ഇ-പാൻ പിഡിഎഫ് വാട്സാപ്പിൽ ലഭിക്കുന്നു." },
      { num: 4, title: "സ്പീഡ് പോസ്റ്റ് ട്രാക്കിംഗ്", desc: "പ്ലാസ്റ്റിക് കാർഡ് വീട്ടിലെത്തുന്നതുവരെ പോസ്റ്റൽ ട്രാക്കിംഗ് സഹായം." }
    ]
  },
  {
    id: "pan-correction",
    category: "pan",
    categoryLabelEn: "PAN Services",
    categoryLabelMl: "പാൻ കാർഡ് സേവനങ്ങൾ",
    icon: "edit_document",
    titleEn: "PAN Card Correction & Reprint",
    titleMl: "പാൻ കാർഡ് തിരുത്തൽ / റീപ്രിന്റ്",
    portalEn: "NSDL / UTIITSL Portal",
    portalMl: "NSDL / UTIITSL പോർട്ടൽ",
    shortDescEn: "Change name, father's name, date of birth, photo/signature update, or re-order lost physical PAN card.",
    shortDescMl: "പേര്, ജനനത്തീയതി, ഫോട്ടോ, ഒപ്പ് എന്നിവയിലെ തെറ്റുകൾ തിരുത്താനും നഷ്ടപ്പെട്ട കാർഡ് വീണ്ടെടുക്കാനും.",
    govtFee: 107,
    serviceFee: 80,
    totalFee: 187,
    deliveryDaysEn: "7–12 Working Days",
    deliveryDaysMl: "7-12 പ്രവൃത്തിദിനങ്ങൾ",
    validityEn: "Lifetime",
    validityMl: "ആജീവനാന്തം",
    issuingBodyEn: "Income Tax Department",
    issuingBodyMl: "ഇൻകം ടാക്സ് ഡിപ്പാർട്ട്മെന്റ്",
    isPopular: false,
    badgeEn: "Correction Support",
    badgeMl: "തിരുത്തൽ സഹായം",
    requiredDocs: [
      { id: "pancorr-oldpan", titleEn: "Existing PAN Number / Copy", titleMl: "നിലവിലുള്ള പാൻ നമ്പർ / കോപ്പി", descEn: "Card copy or allotment letter", descMl: "പഴയ പാൻ കാർഡിന്റെ കോപ്പി", mandatory: true },
      { id: "pancorr-aadhaar", titleEn: "Aadhaar with correct details", titleMl: "ശരിയായ വിവരങ്ങളുള്ള ആധാർ", descEn: "Updated name/DOB proof", descMl: "വിവരങ്ങൾ തിരുത്തിയ പുതിയ ആധാർ", mandatory: true },
      { id: "pancorr-proof", titleEn: "Gazette / Marriage Certificate", titleMl: "ഗസറ്റ് വിജ്ഞാപനം / സർട്ടിഫിക്കറ്റ്", descEn: "If name change is significant", descMl: "പേര് മാറ്റത്തിന് ആവശ്യമെങ്കിൽ", mandatory: false }
    ],
    stepsEn: [
      { num: 1, title: "Discrepancy Audit", desc: "Comparing existing ITD database record with correct Aadhaar details." },
      { num: 2, title: "Correction Filing", desc: "Submission under change/correction category with supporting documents." },
      { num: 3, title: "Dispatch of New Card", desc: "New PVC card with updated details dispatched to registered address." }
    ],
    stepsMl: [
      { num: 1, title: "രേഖാ പരിശോധന", desc: "പഴയ പാൻ വിവരങ്ങളും പുതിയ ആധാർ വിവരങ്ങളും താരതമ്യം ചെയ്യുന്നു." },
      { num: 2, title: "തിരുത്തൽ അപേക്ഷ", desc: "ശരിയായ രേഖകൾ അപ്‌ലോഡ് ചെയ്ത് കറക്ഷൻ അപേക്ഷ നൽകുന്നു." },
      { num: 3, title: "പുതിയ കാർഡ് അയക്കൽ", desc: "തിരുത്തിയ വിവരങ്ങളോടെ പുതിയ കാർഡ് തപാലിൽ എത്തുന്നു." }
    ]
  },
  {
    id: "passport-fresh",
    category: "passport",
    categoryLabelEn: "Passport Services",
    categoryLabelMl: "പാസ്‌പോർട്ട് സേവനങ്ങൾ",
    icon: "travel_explore",
    titleEn: "Fresh Passport & Slot Booking",
    titleMl: "പുതിയ പാസ്‌പോർട്ട് അപേക്ഷ & അപ്പോയിന്റ്മെന്റ്",
    portalEn: "Passport Seva Kendra (PSK / POPSK)",
    portalMl: "പാസ്‌പോർട്ട് സേവാ കേന്ദ്രം (PSK / POPSK)",
    shortDescEn: "Complete online application filling, annexure preparation, fee payment, and priority appointment booking at PSK.",
    shortDescMl: "PSK / POPSK കേന്ദ്രങ്ങളിലേക്ക് ഓൺലൈൻ ഫോം പൂരിപ്പിക്കൽ, ഫീസ് അടയ്ക്കൽ, മുൻഗണനാ അപ്പോയിന്റ്മെന്റ് സ്ലോട്ട് ബുക്കിംഗ്.",
    govtFee: 1500,
    serviceFee: 150,
    totalFee: 1650,
    deliveryDaysEn: "Normal: 10–15 Days | Tatkaal: 3–5 Days",
    deliveryDaysMl: "സാധാരണ: 10-15 ദിവസം | തത്കാൽ: 3-5 ദിവസം",
    validityEn: "10 Years (Adult)",
    validityMl: "10 വർഷം",
    issuingBodyEn: "Ministry of External Affairs, Govt of India",
    issuingBodyMl: "വിദേശകാര്യ മന്ത്രാലയം (ഭാരത സർക്കാർ)",
    isPopular: true,
    badgeEn: "Priority Slot",
    badgeMl: "മുൻഗണനാ സ്ലോട്ട്",
    requiredDocs: [
      { id: "pass-aadhaar", titleEn: "Aadhaar Card", titleMl: "ആധാർ കാർഡ്", descEn: "Address and Identity Proof", descMl: "മേൽവിലാസവും പേരും തെളിയിക്കാൻ", mandatory: true },
      { id: "pass-birth", titleEn: "Birth Certificate / SSLC Book", titleMl: "ജനന സർട്ടിഫിക്കറ്റ് / SSLC ബുക്ക്", descEn: "Date of Birth proof and ECR/Non-ECR eligibility", descMl: "ജനനത്തീയതിക്കും Non-ECR യോഗ്യതയ്ക്കും", mandatory: true },
      { id: "pass-bank", titleEn: "Nationalized Bank Passbook / Voter ID", titleMl: "ബാങ്ക് പാസ്ബുക്ക് / വോട്ടർ ഐഡി", descEn: "Secondary address proof if required", descMl: "കൂടുതൽ മേൽവിലാസ രേഖ ആവശ്യമെങ്കിൽ", mandatory: false }
    ],
    stepsEn: [
      { num: 1, title: "Profile Creation & Verification", desc: "Filling Seva portal forms with non-ECR verification." },
      { num: 2, title: "Govt Challan Payment", desc: "Direct secure fee settlement on Passport gateway." },
      { num: 3, title: "Slot Booking at Convenient PSK", desc: "Selecting fastest available date at PSK Kochi, Kozhikode, Malappuram, etc." },
      { num: 4, title: "Document Dossier Printout", desc: "Complete color file with appointment slip and original check-guide." }
    ],
    stepsMl: [
      { num: 1, title: "പ്രൊഫൈൽ രജിസ്ട്രേഷൻ", desc: "പാസ്‌പോർട്ട് പോർട്ടലിൽ കൃത്യമായ വിവരങ്ങളോടെ അപേക്ഷ തയ്യാറാക്കുന്നു." },
      { num: 2, title: "ഫീസ് അടയ്ക്കൽ", desc: "സർക്കാർ ഫീസ് ₹1500 ഔദ്യോഗിക ഗേറ്റ്‌വേ വഴി സുരക്ഷിതമായി അടയ്ക്കുന്നു." },
      { num: 3, title: "അപ്പോയിന്റ്മെന്റ് സ്ലോട്ട്", desc: "നിങ്ങൾക്ക് സൗകര്യപ്രദമായ PSK കേന്ദ്രത്തിൽ ഏറ്റവും അടുത്ത തീയതി ബുക്ക് ചെയ്യുന്നു." },
      { num: 4, title: "ഫയൽ തയ്യാറാക്കൽ", desc: "PSK യിൽ ഹാജരാക്കേണ്ട രേഖകളുടെ സമ്പൂർണ്ണ പ്രിന്റൗട്ട് ഫയൽ നൽകുന്നു." }
    ]
  },
  {
    id: "ration-card-service",
    category: "ration",
    categoryLabelEn: "Ration Card",
    categoryLabelMl: "റേഷൻ കാർഡ്",
    icon: "groups",
    titleEn: "Ration Card Modification & Addition",
    titleMl: "റേഷൻ കാർഡ് അംഗങ്ങളെ ചേർക്കൽ / തിരുത്തൽ",
    portalEn: "Civil Supplies Kerala (e-Services)",
    portalMl: "സിവിൽ സപ്ലൈസ് വകുപ്പ് കേരള",
    shortDescEn: "Add newborn / spouse after marriage, surrender certificate, card transfer between taluks, and category update.",
    shortDescMl: "വിവാഹശേഷം പേര് ചേർക്കൽ, കുട്ടികളെ ചേർക്കൽ, താലൂക്ക് മാറ്റം, ഒഴിവാക്കൽ സർട്ടിഫിക്കറ്റ് (Non-inclusion/Surrender).",
    govtFee: 0,
    serviceFee: 50,
    totalFee: 50,
    deliveryDaysEn: "5–7 Working Days",
    deliveryDaysMl: "5-7 പ്രവൃത്തിദിനങ്ങൾ",
    validityEn: "Permanent",
    validityMl: "സ്ഥിരം",
    issuingBodyEn: "Taluk Supply Officer (TSO), Kerala",
    issuingBodyMl: "താലൂക്ക് സപ്ലൈ ഓഫീസർ (TSO)",
    isPopular: true,
    badgeEn: "Zero Govt Fee",
    badgeMl: "സർക്കാർ ഫീസില്ല",
    requiredDocs: [
      { id: "rat-current", titleEn: "Original Ration Card Copy", titleMl: "റേഷൻ കാർഡിന്റെ പകർപ്പ്", descEn: "Clear scan of current card", descMl: "നിലവിലെ കാർഡിന്റെ കോപ്പി", mandatory: true },
      { id: "rat-aadhaar", titleEn: "Aadhaar Card of Person Being Added", titleMl: "ചേർക്കുന്ന ആളുടെ ആധാർ", descEn: "With updated address if spouse", descMl: "പുതിയ അംഗത്തിന്റെ ആധാർ കാർഡ്", mandatory: true },
      { id: "rat-surrender", titleEn: "Surrender Certificate / Birth Certificate", titleMl: "ഒഴിവാക്കൽ സർട്ടിഫിക്കറ്റ് / ജനന സർട്ടിഫിക്കറ്റ്", descEn: "From previous ration card / Municipality", descMl: "മുൻ റേഷൻ കാർഡിൽ നിന്നുള്ള റദ്ദാക്കൽ രേഖ", mandatory: true }
    ],
    stepsEn: [
      { num: 1, title: "Surrender & De-linking Check", desc: "Ensuring applicant is released from previous ration card." },
      { num: 2, title: "Civil Supplies Portal Filing", desc: "Uploading family proofs and relationship certificate." },
      { num: 3, title: "TSO Office Approval", desc: "Verification by Taluk Supply Inspector." },
      { num: 4, title: "Updated e-Ration Card", desc: "Instant download of new certified digital ration card." }
    ],
    stepsMl: [
      { num: 1, title: "ഒഴിവാക്കൽ പരിശോധന", desc: "പഴയ കാർഡിൽ നിന്നും പേര് ഒഴിവാക്കിയതിന്റെ സർട്ടിഫിക്കറ്റ് ഉറപ്പാക്കുന്നു." },
      { num: 2, title: "പോർട്ടൽ അപേക്ഷ", desc: "സിവിൽ സപ്ലൈസ് പോർട്ടലിൽ രേഖകൾ സമർപ്പിക്കുന്നു." },
      { num: 3, title: "TSO പരിശോധന", desc: "താലൂക്ക് സപ്ലൈ ഓഫീസറുടെ അംഗീകാരം ലഭിക്കുന്നു." },
      { num: 4, title: "പുതിയ ഇ-റേഷൻ കാർഡ്", desc: "അംഗങ്ങളെ ചേർത്ത പുതിയ ഡിജിറ്റൽ റേഷൻ കാർഡ് ഡൗൺലോഡ് ചെയ്തു നൽകുന്നു." }
    ]
  },
  {
    id: "psc-registration",
    category: "job",
    categoryLabelEn: "Job & PSC",
    categoryLabelMl: "തൊഴിൽ & PSC",
    icon: "school",
    titleEn: "Kerala PSC One-Time Registration (OTR)",
    titleMl: "കേരള PSC ഒറ്റത്തവണ രജിസ്ട്രേഷൻ & പ്രൊഫൈൽ",
    portalEn: "Kerala PSC Thulasi Portal",
    portalMl: "കേരള PSC തുളസി പോർട്ടൽ",
    shortDescEn: "Fresh candidate profile registration, photo/signature resizing per PSC rules, qualification updates, and job applications.",
    shortDescMl: "PSC നിഷ്കർഷിച്ച അളവുകളിൽ ഫോട്ടോയും ഒപ്പും തയ്യാറാക്കൽ, യോഗ്യതകൾ ചേർക്കൽ, പരീക്ഷാ അപേക്ഷകൾ സമർപ്പിക്കൽ.",
    govtFee: 0,
    serviceFee: 40,
    totalFee: 40,
    deliveryDaysEn: "Instant Submission",
    deliveryDaysMl: "തൽസമയ സമർപ്പണം",
    validityEn: "Permanent User ID",
    validityMl: "സ്ഥിരം യൂസർ ഐഡി",
    issuingBodyEn: "Kerala Public Service Commission",
    issuingBodyMl: "കേരള പബ്ലിക് സർവീസ് കമ്മീഷൻ",
    isPopular: true,
    badgeEn: "Instant Confirmation",
    badgeMl: "തൽസമയ കൺഫർമേഷൻ",
    requiredDocs: [
      { id: "psc-photo", titleEn: "Passport Photograph with Name & Date", titleMl: "പേരും തീയതിയും രേഖപ്പെടുത്തിയ ഫോട്ടോ", descEn: "Taken within 6 months as per PSC specifications", descMl: "PSC നിഷ്കർഷിച്ച ഫോർമാറ്റിലുള്ള ഫോട്ടോ", mandatory: true },
      { id: "psc-sign", titleEn: "Signature on White Paper", titleMl: "വെള്ള പേപ്പറിൽ ഒപ്പ്", descEn: "Clear signature within boundary", descMl: "വ്യക്തമായ ഒപ്പ്", mandatory: true },
      { id: "psc-certs", titleEn: "SSLC, Plus Two, Degree Certificates", titleMl: "വിദ്യാഭ്യാസ സർട്ടിഫിക്കറ്റുകൾ", descEn: "For register numbers, percentages, and board details", descMl: "രജിസ്റ്റർ നമ്പറും മാർക്കും രേഖപ്പെടുത്താൻ", mandatory: true },
      { id: "psc-aadhaar", titleEn: "Aadhaar Card", titleMl: "ആധാർ കാർഡ്", descEn: "Identity verification", descMl: "തിരിച്ചറിയൽ രേഖ", mandatory: true }
    ],
    stepsEn: [
      { num: 1, title: "Exact Photo Resizing", desc: "Embedding candidate name and date with exact pixel dimensions." },
      { num: 2, title: "Thulasi Profile Setup", desc: "Entering educational credentials and community claims." },
      { num: 3, title: "Application Submission", desc: "Applying to active category notifications with instant acknowledgement." },
      { num: 4, title: "Hall Ticket Support", desc: "Continuous SMS alerts for exam dates and admission tickets." }
    ],
    stepsMl: [
      { num: 1, title: "ഫോട്ടോ എഡിറ്റിംഗ്", desc: "പേരും തീയതിയും കൃത്യമായ സൈസിലും പിക്സലിലും ക്രമീകരിക്കുന്നു." },
      { num: 2, title: "പ്രൊഫൈൽ എൻട്രി", desc: "വിദ്യാഭ്യാസ യോഗ്യതകളും മാർക്കുകളും തെറ്റുകളില്ലാതെ രേഖപ്പെടുത്തുന്നു." },
      { num: 3, title: "അപേക്ഷ സമർപ്പണം", desc: "നിലവിലുള്ള വിജ്ഞാപനങ്ങളിലേക്ക് തൽസമയം അപേക്ഷ സമർപ്പിക്കുന്നു." },
      { num: 4, title: "പരീക്ഷാ അറിയിപ്പുകൾ", desc: "ഹാൾടിക്കറ്റ് ഡൗൺലോഡ് ചെയ്യുന്നതിനും തുടർ വിവരങ്ങൾക്കും സഹായം." }
    ]
  },
  {
    id: "jeevan-pramaan",
    category: "certificates",
    categoryLabelEn: "Welfare & Pension",
    categoryLabelMl: "ക്ഷേമം & പെൻഷൻ",
    icon: "fingerprint",
    titleEn: "Digital Life Certificate (Jeevan Pramaan)",
    titleMl: "ഡിജിറ്റൽ ലൈഫ് സർട്ടിഫിക്കറ്റ് (ജീവൻ പ്രമാൺ)",
    portalEn: "Jeevan Pramaan Portal (Govt of India)",
    portalMl: "ജീവൻ പ്രമാൺ പോർട്ടൽ (ഭാരത സർക്കാർ)",
    shortDescEn: "Biometric thumb/face scan life certificate generation for state, central, defense, and bank pensioners without traveling.",
    shortDescMl: "ബാങ്കുകളിലോ ട്രഷറിയിലോ പോകാതെ വൃദ്ധരായ പെൻഷൻകാർക്ക് വിരലടയാളം / ഫേസ് സ്കാൻ വഴി തൽസമയ ജീവൻ പ്രമാൺ.",
    govtFee: 0,
    serviceFee: 30,
    totalFee: 30,
    deliveryDaysEn: "Instant Generation (5 mins)",
    deliveryDaysMl: "തൽസമയം (5 മിനിറ്റ്)",
    validityEn: "1 Year",
    validityMl: "1 വർഷം",
    issuingBodyEn: "Pension Disbursing Authority (Treasury / Banks / EPFO)",
    issuingBodyMl: "പെൻഷൻ അതോറിറ്റി (ട്രഷറി / ബാങ്ക് / EPFO)",
    isPopular: true,
    badgeEn: "Senior Friendly",
    badgeMl: "മുതിർന്നവർക്ക് മുൻഗണന",
    requiredDocs: [
      { id: "jp-aadhaar", titleEn: "Pensioner's Aadhaar Card", titleMl: "പെൻഷൻകാരന്റെ ആധാർ കാർഡ്", descEn: "For biometric fingerprint / iris authentication", descMl: "ബയോമെട്രിക് പരിശോധനയ്ക്കായി", mandatory: true },
      { id: "jp-ppo", titleEn: "PPO Number & Pension Passbook", titleMl: "PPO നമ്പറും പെൻഷൻ പാസ്ബുക്കും", descEn: "Pension Payment Order details", descMl: "പെൻഷൻ ബുക്കിലെ PPO നമ്പർ", mandatory: true },
      { id: "jp-bank", titleEn: "Pension Bank Account Number", titleMl: "പെൻഷൻ അക്കൗണ്ട് നമ്പർ", descEn: "Account into which pension is credited", descMl: "പെൻഷൻ വരുന്ന ബാങ്ക് അക്കൗണ്ട് നമ്പർ", mandatory: true }
    ],
    stepsEn: [
      { num: 1, title: "PPO & Bank Details Entry", desc: "Selecting treasury or bank branch and entering PPO number." },
      { num: 2, title: "Biometric Fingerprint Authentication", desc: "Instant UIDAI biometric capture using certified scanner." },
      { num: 3, title: "Pramaan ID SMS Delivery", desc: "Official confirmation SMS sent directly from Jeevan Pramaan portal." }
    ],
    stepsMl: [
      { num: 1, title: "PPO വിവരങ്ങൾ രേഖപ്പെടുത്തൽ", desc: "ട്രഷറി / ബാങ്ക് വിവരങ്ങളും PPO നമ്പറും നൽകുന്നു." },
      { num: 2, title: "ബയോമെട്രിക് വിരലടയാളം", desc: "സർട്ടിഫൈഡ് സ്കാനർ വഴി തൽസമയം വിരലടയാളം രേഖപ്പെടുത്തുന്നു." },
      { num: 3, title: "കൺഫർമേഷൻ SMS", desc: "കേന്ദ്ര സർക്കാരിന്റെ ഔദ്യോഗിക Pramaan ID തൽസമയം ഫോണിൽ ലഭിക്കുന്നു." }
    ]
  },
  {
    id: "vahan-road-tax",
    category: "certificates",
    categoryLabelEn: "Transport & RTO",
    categoryLabelMl: "മോട്ടോർ വാഹനം & RTO",
    icon: "directions_car",
    titleEn: "Vehicle & Road Tax Payment",
    titleMl: "വാഹന റോഡ് നികുതി അടയ്ക്കൽ",
    portalEn: "Parivahan Sewa / Vahan Citizen Portal",
    portalMl: "പരിവാഹൻ സേവ / വാഹൻ പോർട്ടൽ",
    shortDescEn: "Instant online road tax payment for commercial and private vehicles with government tax receipt download.",
    shortDescMl: "സ്വകാര്യ, കൊമേഴ്സ്യൽ വാഹനങ്ങളുടെ റോഡ് ടാക്സ്, പെർമിറ്റ് ഫീസ് അടയ്ക്കലും തൽസമയ രസീത് ലഭ്യമാക്കലും.",
    govtFee: 0,
    serviceFee: 40,
    totalFee: 40,
    deliveryDaysEn: "Instant Receipt",
    deliveryDaysMl: "തൽസമയ രസീത്",
    validityEn: "As per Tax Period",
    validityMl: "നികുതി കാലാവധി പ്രകാരം",
    issuingBodyEn: "Motor Vehicles Department (MVD Kerala)",
    issuingBodyMl: "മോട്ടോർ വാഹന വകുപ്പ് (MVD കേരളം)",
    isPopular: false,
    badgeEn: "Instant Receipt",
    badgeMl: "തൽസമയ രസീത്",
    requiredDocs: [
      { id: "tax-rc", titleEn: "Vehicle RC Book Copy", titleMl: "വാഹനത്തിന്റെ RC ബുക്ക്", descEn: "Chassis and Engine numbers", descMl: "രജിസ്ട്രേഷൻ നമ്പറും ചേസിസ് നമ്പറും", mandatory: true },
      { id: "tax-old", titleEn: "Previous Tax Token / Receipt", titleMl: "മുൻ നികുതി രസീത്", descEn: "To verify previous cleared period", descMl: "കഴിഞ്ഞ തവണ അടച്ച നികുതി വിവരങ്ങൾ", mandatory: false }
    ],
    stepsEn: [
      { num: 1, title: "Vahan Registration Fetch", desc: "Pulling vehicle tax arrears directly from MoRTH servers." },
      { num: 2, title: "Gateway Payment", desc: "Online payment with zero penalty." },
      { num: 3, title: "QR Tax Token Printout", desc: "Official Kerala MVD approved road tax token." }
    ],
    stepsMl: [
      { num: 1, title: "വാഹന വിവരങ്ങൾ ശേഖരിക്കൽ", desc: "RC നമ്പർ ഉപയോഗിച്ച് കുടിശ്ശിക വിവരങ്ങൾ പോർട്ടലിൽ കണ്ടെത്തുന്നു." },
      { num: 2, title: "നികുതി അടയ്ക്കൽ", desc: "സുരക്ഷിതമായി ഓൺലൈൻ വഴി നികുതി തുക അടയ്ക്കുന്നു." },
      { num: 3, title: "നികുതി രസീത്", desc: "MVD അംഗീകൃത ഒഫീഷ്യൽ ടാക്സ് ടോക്കൺ പ്രിന്റൗട്ട് തൽസമയം ലഭിക്കുന്നു." }
    ]
  },
  {
    id: "printing-scanning",
    category: "print",
    categoryLabelEn: "Print & Document",
    categoryLabelMl: "പ്രിന്റിംഗ് & രേഖകൾ",
    icon: "print",
    titleEn: "Legal Printing, Scanning & Lamination",
    titleMl: "പ്രിന്റിംഗ്, സ്കാനിംഗ് & ലാമിനേഷൻ",
    portalEn: "In-Store Fast Desk Services",
    portalMl: "സെന്റർ തൽസമയ സേവനങ്ങൾ",
    shortDescEn: "Laser color prints, bond paper documentation, legal affidavit formatting, high-dpi scanning, and plastic card lamination.",
    shortDescMl: "ലേസർ കളർ പ്രിന്റുകൾ, ബോണ്ട് പേപ്പർ ഡോക്യുമെന്റുകൾ, ഹൈ-ക്വാളിറ്റി സ്കാനിംഗ്, ലാമിനേഷൻ സേവനങ്ങൾ.",
    govtFee: 0,
    serviceFee: 10,
    totalFee: 10,
    deliveryDaysEn: "Instant Walk-in",
    deliveryDaysMl: "തൽസമയം",
    validityEn: "Permanent",
    validityMl: "സ്ഥിരം",
    issuingBodyEn: "Nexa Digital Facilitation Center",
    issuingBodyMl: "നെക്സ ഡിജിറ്റൽ സെന്റർ",
    isPopular: false,
    badgeEn: "Laser Quality",
    badgeMl: "ഹൈ-ക്വാളിറ്റി",
    requiredDocs: [
      { id: "print-soft", titleEn: "PDF or Image File via WhatsApp / USB", titleMl: "വാട്സാപ്പ് അല്ലെങ്കിൽ ഫോൺ വഴി ഫയൽ", descEn: "Send directly to WhatsApp (+91 94470 12345)", descMl: "ഞങ്ങളുടെ വാട്സാപ്പിലേക്ക് നേരിട്ട് അയക്കാം", mandatory: true }
    ],
    stepsEn: [
      { num: 1, title: "Send File to WhatsApp", desc: "Share document with our official counter WhatsApp number." },
      { num: 2, title: "Inspection & Page Setup", desc: "Ensuring proper margins and legal paper sizing." },
      { num: 3, title: "Instant Laser Output", desc: "Sharp waterproof prints and hot pouch lamination." }
    ],
    stepsMl: [
      { num: 1, title: "ഫയൽ വാട്സാപ്പിൽ അയക്കുക", desc: "പ്രിന്റ് ചെയ്യേണ്ട ഫയലുകൾ വാട്സാപ്പിൽ അയച്ചുതരിക." },
      { num: 2, title: "സൈസ് ക്രമീകരിക്കൽ", desc: "ലീഗൽ അല്ലെങ്കിൽ A4 സൈസുകളിൽ കൃത്യത ഉറപ്പാക്കുന്നു." },
      { num: 3, title: "തൽസമയ പ്രിന്റൗട്ട്", desc: "വാട്ടർപ്രൂഫ് ലേസർ പ്രിന്റും ലാമിനേഷനും ഉടൻ കൈപ്പറ്റാം." }
    ]
  }
];

// Helper functions for easy lookup
function getServiceById(id) {
  return SERVICES_DATA.find(s => s.id === id) || SERVICES_DATA[0];
}

function getServicesByCategory(cat) {
  if (!cat || cat === 'all') return SERVICES_DATA;
  return SERVICES_DATA.filter(s => s.category === cat);
}

function searchServices(query) {
  if (!query) return SERVICES_DATA;
  const q = query.toLowerCase().trim();
  return SERVICES_DATA.filter(s => {
    return (
      s.titleEn.toLowerCase().includes(q) ||
      s.titleMl.toLowerCase().includes(q) ||
      s.shortDescEn.toLowerCase().includes(q) ||
      s.shortDescMl.toLowerCase().includes(q) ||
      s.categoryLabelEn.toLowerCase().includes(q) ||
      s.categoryLabelMl.toLowerCase().includes(q)
    );
  });
}
