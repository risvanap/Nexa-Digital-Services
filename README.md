# Nexa Digital Services (നെക്സ ഡിജിറ്റൽ സർവീസസ്)

An independent citizen digital services facilitation center website (Akshaya / CSC style) built strictly according to the **Google Stitch Design Project** reference:
[https://stitch.withgoogle.com/projects/15155120508271446054](https://stitch.withgoogle.com/projects/15155120508271446054)

---

## 🌟 Key Features

1. **Faithful Google Stitch Design System**
   - **Colors**: Primary Marine Navy (`#01284B`), Primary Container (`#1E3E62`), Civic Royal Cobalt (`#0453CD`), WhatsApp Kerala Communication Green (`#128C7E` / `#25D366`), Surface Tint (`#426086`), Surface Canvas (`#F9F9FF`), and Tonal Layers (`#F0F3FF`, `#E7EEFF`, `#DEE8FF`).
   - **Typography**: Geometric `Plus Jakarta Sans` paired with `Noto Sans Malayalam` for seamless baseline rendering without clipping ascenders/descenders.
   - **Icons**: Google Material Symbols Outlined.

2. **Bilingual Malayalam (മലയാളം) & English Support**
   - Live header language switch toggle (`മല | ENG`).
   - Persisted language preference in `localStorage`.
   - Dual-language parallel headlines and microcopy for every service and statutory notice.

3. **Complete Citizen Service Architecture (NOT a portfolio)**
   - **Home (`index.html`)**: Quick intro banner, interactive search & filter chips, popular services grid with fee breakdowns, 3-step citizen process, value propositions, document checklist helper, FAQs accordion, working hours, and physical branch summaries.
   - **Services (`services.html`)**: Complete directory of 45+ citizen facilitation services (e-District Revenue Certificates, PAN Cards, Passport Seva, Civil Supplies Ration Cards, Kerala PSC Thulasi OTR, Jeevan Pramaan Life Certificates, Vehicle Road Tax, Legal Printing & Scanning).
   - **Service Details (`service-details.html`)**: Dynamic service routing via query params (`?id=income-certificate`, `?id=pan-new`, etc.), transparent fee breakdown (Govt fee vs Nexa charge), 4-stage process stepper, verified facilitator spotlight (Anjana S.), interactive essential documents checklist with live counter, and direct document upload drawer.
   - **About (`about.html`)**: 6+ years history, 42k+ citizens served, Citizen Credo, operational pillars, and privacy safeguards.
   - **Contact (`contact.html`)**: Instant support desks (WhatsApp helpline `+91 94470 12345`, Kakkanad landline `0484 2987654`, email `help@nexadigital.in`), interactive branch switch tabs (Kakkanad HQ Ernakulam vs Palakkad Stadium Desk), Google Maps navigation links, and a Quick Citizen Callback Form with 15-minute response guarantee.
   - **Track Status (`track.html`)**: Public citizen application tracker by reference ID (e.g., `KL-REV-2026-8942`) with 4-stage milestone rail + Operator/Staff console with real-time KPI metrics and enquiry list.

4. **Integrated WhatsApp Customer Application Workflow**
   - Floating WhatsApp pulse button on all screens with live online dot.
   - Every service card features a dedicated 1-click WhatsApp application trigger pre-filled with the exact service name and details.
   - Document upload drawer lets citizens upload or name documents and transition directly into WhatsApp with a formatted application draft.

5. **Fully Responsive Across Mobile & Desktop**
   - **Mobile**: Sticky app header, 48px touch targets, mobile bottom navigation bar matching Stitch mobile shell, and bottom sticky application drawer.
   - **Desktop**: Full responsive top navbar, multi-column grids (2-3 columns), sticky pricing sidebars, and wide multi-column footer.

6. **Statutory Independence Transparency**
   - Distinct, explicit notices in both Malayalam and English clarifying that Nexa Digital Services is an independent citizen facilitation kiosk and not a government body.

---

## 📂 Project Structure

```
d:\My Websites\Nexa Digital Services\
├── index.html              # Home Page (Popular services, checklist, FAQs, Trust banner)
├── services.html           # All Services Catalog (Filter chips, instant search)
├── service-details.html    # Interactive Service Details (Checklist, Pricing, Stepper)
├── about.html              # About Nexa Digital Services (Credo, Stats, Pillars)
├── contact.html            # Contact & Physical Branches (Callback form, Maps)
├── track.html              # Application Tracker & Operator Console
├── css/
│   └── styles.css          # Design system tokens, Malayalam fonts, pulse animations
├── js/
│   ├── services-data.js    # Master catalog of authentic Kerala CSC/Akshaya services
│   ├── i18n.js             # Bilingual Malayalam/English translation engine
│   └── components.js       # Reusable Header, Footer, Bottom Nav, WhatsApp CTA
└── README.md               # Documentation and execution guide
```

---

## 🚀 How to Run the Website

The website is built with modern, standard HTML5, CSS3, Tailwind CSS, and vanilla modular JavaScript. It requires **no compilation, no bundlers, and no npm installation**.

### Option 1: Direct Browser Open (Simplest)
Double-click on `index.html` (or right-click and choose **Open with > Chrome / Edge / Firefox**). Every link, filter, search, checklist, and bilingual toggle works immediately.

### Option 2: Using Python's Built-in Server (Recommended)
Open a terminal in the project folder and run:
```bash
python -m http.server 8000
```
Then navigate to:
```
http://localhost:8000
```

### Option 3: Using Node / npx serve
```bash
npx serve .
```

### Option 4: VS Code Live Server
If you use VS Code, right-click `index.html` and select **"Open with Live Server"**.

---

## 📞 Support & Contacts
- **WhatsApp Helpline:** `+91 94470 12345`
- **Kakkanad Center Desk:** `0484 2987654`
- **Email:** `help@nexadigital.in`
- **Main Center Address:** Near Civil Station Road, Kakkanad, Ernakulam, Kerala - 682030
