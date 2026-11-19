# NEXA DIGITAL SERVICES – AI CUSTOMER SUPPORT CHATBOT

> **Production-Ready, Modern AI-Powered Customer Support Assistant for NEXA DIGITAL SERVICES**<br/>
> *Independent Citizen Digital Service Centre • Kerala, India*<br/>
> **Official Business WhatsApp:** [+91 8086380373](https://wa.me/918086380373)

---

## 🌟 Executive Summary

This project delivers an enterprise-grade, modern AI-powered customer support chatbot integrated seamlessly into the **NEXA DIGITAL SERVICES** website without breaking, altering, or redesigning the existing website design.

### 🎯 Key Highlights
1. **Seamless Website Integration**: Injected unobtrusively via a floating launcher button at bottom-right on all website pages (`index.html`, `services.html`, `service-details.html`, `about.html`, `contact.html`, `track.html`).
2. **Dedicated Standalone Chat Page**: Accessible at [`chatbot.html`](./chatbot.html) for citizens preferring a full-screen conversational desk.
3. **Dedicated Admin Dashboard**: Accessible at [`admin.html`](./admin.html) featuring live KPI stats, Customer Enquiry Management, Master 43 Services Management, and AI Knowledge Base / FAQ manager.
4. **Complete 43 Services Knowledge Base**: Covering all 7 categories without omitting a single service.
5. **Natural Malayalam (മലയാളം) & English Support**: Automatic language detection and seamless manual toggle at any point. Natural Kerala phrasing with zero robotic machine translations.
6. **Statutory Guardrails**:
   - Explicit disclaimers stating Nexa Digital Services is an independent private digital service centre and not a government body.
   - **Zero Aadhaar Services**: Strict programmatic blocking of Aadhaar enrollment and biometric modification queries with clear redirection to official UIDAI bank/post-office centres.
   - **Zero Sensitive Data Inquiries**: Never asks for banking passwords, UPI PINs, ATM cards, or confidential OTPs.
7. **Direct WhatsApp Integration**: Pre-filled customer application leads linking directly to official business WhatsApp **+91 8086380373**.
8. **Dual-Mode AI Engine**: Connects to OpenAI API (`gpt-4o-mini`) when `OPENAI_API_KEY` is present; automatically and gracefully falls back to an intelligent local conversational NLP engine so the chatbot is **100% functional out of the box** even before configuring API keys!

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, TypeScript, Tailwind CSS, Lucide Icons, Mobile-first Responsive Design |
| **Backend** | Node.js, Express.js (v5), REST API, Rate Limiting (`express-rate-limit`), CORS, Dotenv |
| **AI Integration** | OpenAI API (`openai`), Context-Aware Prompt Injection, Natural Malayalam & English Language Processor, Rule-Based Fallback Engine |
| **Database** | Supabase PostgreSQL with Row Level Security (RLS), UUIDs, Indexes, and Local Resilient File-Store fallback |
| **Authentication** | Supabase Auth for Administrators (with demo fallback for local development) |
| **Deployment** | Vercel (Frontend & Serverless API via `vercel.json`), or any secure Node.js hosting (Railway, Render, VPS) |

---

## 🏛️ Complete 43 Services Knowledge Base

The chatbot covers all **43 services** across 7 distinct categories:

### Category A – Government Services
1. **Village Services (e-District)**: Income, Caste, Nativity, Possession, Non-Creamy Layer, Location, Relationship certificates.
2. **Panchayath / Municipality Services (K-SMART / Sevana)**: Birth, Death, Marriage registration, Trade license, Building ownership certificate.
3. **Registration Department Services (PEARL)**: Encumbrance Certificate (EC), Certified Deed Copies, Fair Value search, Token booking.
4. **Police Department Services (Thuna Portal)**: Police Clearance Certificate (PCC) for job/abroad, Non-involvement in offences certificate, Lost article report.
5. **CM's Grievance Redressal / CMDRF**: Chief Minister's Distress Relief Fund medical and calamity assistance, CMO grievance petitions.
6. **Welfare Registrations and E-Payments**: Labour Welfare Boards (Construction, Motor Transport, Tailoring, Agriculture) monthly contribution e-payments.
7. **Labour Department Services (LCAS)**: Shops & Commercial Establishments registration & renewal, AWAZ migrant worker cards.

### Category B – Identity & Document Services
8. **Passport Services**: Fresh passport, Renewal/Re-issue, Tatkaal fast-track, Minor passport, PSK appointment slots.
9. **PAN Card Services**: New PAN (Form 49A), PAN Correction/Update, Lost PAN reprint, PAN-Aadhaar linking assistance.
10. **Ration Card Services (e-CivilSupplies)**: New Ration Card, Add family member, Remove member (Reduction cert), Address change, Category change.
11. **Voter ID Services (ECI)**: New Voter Registration (Form 6), Form 8 correction/shifting, e-EPIC download, Overseas voter (Form 6A).
12. **E-Shram Card Services**: Unorganized worker national database registration, UAN card download, profile update.
13. **Digital Signature Certificate (DSC)**: Class 3 Individual/Organization DSC on secure cryptographic USB tokens.

### Category C – Business & Registration Services
14. **Company Registration (MCA)**: Private Limited, One Person Company (OPC), LLP, Partnership deed drafting.
15. **GST Services**: New GST registration, Monthly/Quarterly returns (GSTR-1, GSTR-3B), Annual return, E-Way bills.
16. **Trademark Registration**: Brand name and logo search, Form TM-A filing, Objection handling.
17. **MSME Udyam Registration**: Udyam certificate with QR code, enterprise classification updates.
18. **KSWIFT Registration**: Kerala Single Window Interface clearances and Acknowledgement Certificates for MSMEs.
19. **FSSAI Food Safety Registration (FoSCoS)**: Basic Food Registration, State Food License, Annual returns.
20. **Website Development**: Custom business websites, e-commerce storefronts, Google Business Profiles, SEO optimization.

### Category D – Education & Career Services
21. **University Services**: Kerala, MG, Calicut, KTU, Kannur: Degree certificates, Migration, Transcripts, Revaluation.
22. **PSC Related Services**: Kerala PSC Thulasi One Time Registration (OTR), Category applications, Confirmation, Hall tickets.
23. **Employment Registration**: Kerala Employment Exchange registration, Seniority renewal, Higher qualifications addition.
24. **Educational Related Services**: SSLC / Higher Secondary duplicate certificates, Migration, Equivalence certificates.
25. **Scholarship Services**: National Scholarship Portal (NSP), DCE Kerala scholarships (Suvarna Jubilee, Post Matric).
26. **Job Related Applications**: Central Govt (SSC, UPSC, Railway RRB, Banking IBPS), Defense Agniveer, State PSUs.
27. **UG CAP – Undergraduate Centralised Admission**: Calicut, MG, Kerala, Kannur degree single-window admission process.
28. **PG CAP – Postgraduate Centralised Admission**: University post-graduate (MA, MSc, MCom, MBA) admission option registration.

### Category E – Vehicle & Transport Services
29. **RTO / MVD Services (Sarathi)**: Learner's Licence, Driving Licence test slot booking, DL Renewal, Duplicate DL, International Driving Permit.
30. **Vehicle Related Services (Vahan)**: RC Ownership Transfer (Form 29 & 30), Loan HP cancellation (Form 35), Road Tax, Fitness inspection slot, Duplicate RC.

### Category F – Financial & Payment Services
31. **Insurance Services**: Two-wheeler, Car, Commercial vehicle, Health insurance renewal and instant policy issuance.
32. **Tax Payment Services**: Kerala Land Tax (Thandapper e-Payment), Sanchaya Municipal Property Tax, Professional Tax.
33. **Loan EMI Payments**: NBFC, Bank, Microfinance, Gold loan, and Vehicle loan EMI payment via BBPS.
34. **Pension Services**: Sevana Social Security Pension, Jeevan Pramaan Digital Life Certificate, Annual mustering.
35. **Utility Bill Payments**: Broadband, Landline, Piped Gas (PNG), Postpaid bills via Bharat BillPay.
36. **KSEB Related Services**: Electricity bill payment, New LT connection application, Ownership transfer, Tariff change.
37. **Kerala Water Authority Services**: KWA Water bill payment, New domestic connection application, Name transfer.
38. **Mobile Recharge**: Prepaid recharges and validity plans for Jio, Airtel, Vi, and BSNL.
39. **TV Recharge**: DTH Recharges for Sun Direct, Tata Play, Airtel Digital TV, Dish TV, d2h.

### Category G – Travel & Other Services
40. **Pravasi Services**: NORKA Roots Pravasi ID card, Pravasi Welfare Board pension, NDPREM loan subsidy, Certificate attestation.
41. **Travel Services**: Domestic & International flight tickets, IRCTC train reservation, Tourist/Visit visa assistance.
42. **KSRTC Bus Booking**: KSRTC Swift, Super Deluxe, Minnal seat reservations and cancellations.
43. **Farmers Related Services**: PM-KISAN Samman Nidhi e-KYC, AIMS Kerala Farmer Portal registration, Crop insurance.

---

## 🚀 Installation & Local Development Instructions

### 1. Prerequisites
- **Node.js** v18 or later (v24 tested & supported)
- **npm** v9 or later

### 2. Setup Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Open `.env` and configure your credentials (or keep empty to run on the built-in fallback engine):
```env
PORT=3000
NODE_ENV=development
OPENAI_API_KEY=your-openai-api-key-here
OPENAI_MODEL=gpt-4o-mini
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key-here
```

### 3. Install Dependencies
```bash
# Install backend dependencies
npm install

# Install client dependencies
npm --prefix client install
```

### 4. Build Client Bundles
```bash
npm run build
```
This builds the React & TypeScript bundles into `dist-client/`:
- `nexa-chatbot.js` (widget for all website pages)
- `nexa-chatbot.css` (custom styling)
- `standalone-chat.js` (fullscreen chatbot page)
- `admin-dashboard.js` (admin management portal)

### 5. Start the Server
```bash
npm start
```
The server will boot and display:
```
====================================================
🚀 NEXA DIGITAL SERVICES - Production Server
🌐 Website URL: http://localhost:3000
💬 Chat API:    http://localhost:3000/api/chat
🩺 Health API:  http://localhost:3000/api/health
📱 WhatsApp:    +91 8086380373
====================================================
```

### 6. URLs to Open in Your Browser
- **Public Website with Chatbot Launcher**: [http://localhost:3000](http://localhost:3000)
- **Standalone AI Chatbot Page**: [http://localhost:3000/chatbot.html](http://localhost:3000/chatbot.html)
- **Admin Management Portal**: [http://localhost:3000/admin.html](http://localhost:3000/admin.html)
- **All Services Catalog**: [http://localhost:3000/services.html](http://localhost:3000/services.html)
- **Application Tracking**: [http://localhost:3000/track.html](http://localhost:3000/track.html)

---

## ☁️ Production Deployment Guide

### Option 1: Deploying to Vercel (Recommended)
1. Push your repository to GitHub or GitLab.
2. Go to [Vercel](https://vercel.com) and click **Add New Project**.
3. Import your repository.
4. In **Project Settings** -> **Environment Variables**, add:
   - `OPENAI_API_KEY`
   - `OPENAI_MODEL` (`gpt-4o-mini`)
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
5. Click **Deploy**. Vercel will automatically read `vercel.json` and serve both the static website and the serverless `/api/*` endpoints!

### Option 2: Deploying to Railway / Render / DigitalOcean / VPS
1. Run `npm install` and `npm run build`.
2. Set environment variables on your cloud hosting dashboard.
3. Start command: `node server/server.js` or `npm start`.

---

## 🧪 Testing Checklist

Use this checklist to verify full functionality:

- [x] **Website Integration**: Open `http://localhost:3000` -> Floating NEXA AI launcher button appears at bottom-right with online indicator.
- [x] **Open / Close / Minimize**: Click launcher button -> smooth animation opens chat window; close and minimize buttons work smoothly.
- [x] **Malayalam Conversation**: Send message `"എനിക്ക് പാസ്പോർട്ട് എടുക്കണം"` -> Bot responds in natural conversational Malayalam, displays subservices, documents checklist, fee breakdown, and action chips.
- [x] **English Conversation**: Send message `"How can I apply for a new PAN card?"` -> Bot responds in clear English, lists Form 49A, required documents, government fee ₹107 vs Nexa charge ₹60.
- [x] **Statutory Aadhaar Block**: Send `"I want to make a new Aadhaar card"` or `"എനിക്ക് ആധാർ കാർഡ് എടുക്കണം"` -> Bot immediately displays statutory notice that Aadhaar enrolments are strictly restricted to official UIDAI bank/post-office desks.
- [x] **Document Checklist System**: Click "View Documents" on any matched service -> Modal opens with comprehensive verified document requirements and procedure steps.
- [x] **Customer Enquiry Workflow**: Click "Apply Now" -> Form opens pre-filled with the selected service. Enter name and 10-digit mobile number -> Review confirmation preview -> Submit -> Unique Reference Number (e.g. `NX-2026-XXXX`) generated and stored!
- [x] **WhatsApp Integration**: Click "Open in WhatsApp" -> Opens `https://wa.me/918086380373` with customer's enquiry reference and details pre-formatted.
- [x] **Admin Dashboard**: Open `http://localhost:3000/admin.html` -> Login with admin email or click "Instant Access as Nexa Desk Admin" -> View live KPI statistics, manage all 43 services, view/filter customer enquiries, update enquiry statuses, and manage AI FAQs.
- [x] **Language Switching**: Toggle between Malayalam (`മല`) and English (`ENG`) at any point during active conversation -> UI and assistant dynamically adapt.
- [x] **Health Check Endpoint**: Visit `http://localhost:3000/api/health` -> Returns JSON status `{ status: "healthy", business: { whatsapp: "+91 8086380373", services_count: 43 } }`.

---

## 🛡️ Security & Privacy Notice

- **Zero Exposure of Keys**: The OpenAI API key and Supabase Service Role Key are maintained strictly server-side and never exposed to client-side bundles.
- **Data Minimization**: Only essential details (Name, Mobile, Service, Description) are collected for enquiry follow-up.
- **No Sensitive Files or Passwords**: Never prompts for passwords, ATM PINs, OTPs, or passport identity scans in the chat interface.
- **Statutory Non-Affiliation**: Clear legal disclaimers state that Nexa Digital Services is an independent citizen facilitation kiosk and not an official government department.
