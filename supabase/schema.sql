-- ====================================================================
-- NEXA DIGITAL SERVICES - AI CUSTOMER SUPPORT CHATBOT DATABASE SCHEMA
-- Target Database: Supabase PostgreSQL
-- Generated: 2026-11-19
-- ====================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Drop existing tables if re-running migration
DROP TABLE IF EXISTS enquiry_messages CASCADE;
DROP TABLE IF EXISTS customer_enquiries CASCADE;
DROP TABLE IF EXISTS service_faqs CASCADE;
DROP TABLE IF EXISTS service_documents CASCADE;
DROP TABLE IF EXISTS services CASCADE;
DROP TABLE IF EXISTS admin_users CASCADE;
DROP TABLE IF EXISTS chatbot_settings CASCADE;

-- ====================================================================
-- TABLE 1: services
-- Master catalog of all 43 services across 7 categories
-- ====================================================================
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  service_key VARCHAR(100) UNIQUE NOT NULL,
  category_id VARCHAR(50) NOT NULL,
  category_name_en VARCHAR(100) NOT NULL,
  category_name_ml VARCHAR(100) NOT NULL,
  number INT NOT NULL,
  name_en VARCHAR(255) NOT NULL,
  name_ml VARCHAR(255) NOT NULL,
  description_en TEXT NOT NULL,
  description_ml TEXT NOT NULL,
  subservices JSONB DEFAULT '[]'::jsonb,
  eligibility_en TEXT,
  eligibility_ml TEXT,
  procedure_en TEXT,
  procedure_ml TEXT,
  official_portal_name VARCHAR(255),
  official_portal_url VARCHAR(500),
  govt_fee NUMERIC(10, 2) DEFAULT 0.00,
  nexa_service_charge NUMERIC(10, 2) DEFAULT 0.00,
  processing_time_en VARCHAR(255),
  processing_time_ml VARCHAR(255),
  is_active BOOLEAN DEFAULT TRUE,
  last_verified_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ====================================================================
-- TABLE 2: service_documents
-- Reusable document requirements per service
-- ====================================================================
CREATE TABLE service_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  service_id UUID REFERENCES services(id) ON DELETE CASCADE,
  service_key VARCHAR(100) NOT NULL,
  name_en VARCHAR(255) NOT NULL,
  name_ml VARCHAR(255) NOT NULL,
  is_mandatory BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ====================================================================
-- TABLE 3: service_faqs
-- Bilingual FAQs and knowledge items for AI & customer display
-- ====================================================================
CREATE TABLE service_faqs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  service_key VARCHAR(100) DEFAULT 'general',
  question_en TEXT NOT NULL,
  question_ml TEXT NOT NULL,
  answer_en TEXT NOT NULL,
  answer_ml TEXT NOT NULL,
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ====================================================================
-- TABLE 4: customer_enquiries
-- Customer leads, applications, and support tickets
-- ====================================================================
CREATE TABLE customer_enquiries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reference_id VARCHAR(50) UNIQUE NOT NULL,
  customer_name VARCHAR(255) NOT NULL,
  mobile_number VARCHAR(20) NOT NULL,
  service_key VARCHAR(100) NOT NULL,
  service_name VARCHAR(255) NOT NULL,
  application_type VARCHAR(255),
  short_description TEXT,
  preferred_contact_method VARCHAR(50) DEFAULT 'whatsapp',
  preferred_language VARCHAR(10) DEFAULT 'ml',
  status VARCHAR(50) DEFAULT 'pending', -- pending, in_progress, completed, cancelled
  internal_notes TEXT,
  assigned_to VARCHAR(100),
  whatsapp_sent BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ====================================================================
-- TABLE 5: enquiry_messages
-- Conversation turns associated with an enquiry or active chat
-- ====================================================================
CREATE TABLE enquiry_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  enquiry_id UUID REFERENCES customer_enquiries(id) ON DELETE CASCADE,
  reference_id VARCHAR(50),
  sender_type VARCHAR(20) NOT NULL, -- 'user', 'assistant', 'admin'
  message_content TEXT NOT NULL,
  language VARCHAR(10) DEFAULT 'ml',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ====================================================================
-- TABLE 6: admin_users
-- Profile information for administrators
-- ====================================================================
CREATE TABLE admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  supabase_auth_id UUID UNIQUE,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  role VARCHAR(50) DEFAULT 'operator', -- 'superadmin', 'admin', 'operator'
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ====================================================================
-- TABLE 7: chatbot_settings
-- System configuration and AI parameters
-- ====================================================================
CREATE TABLE chatbot_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  setting_key VARCHAR(100) UNIQUE NOT NULL,
  setting_value JSONB NOT NULL,
  description TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ====================================================================
-- INDEXES FOR HIGH PERFORMANCE
-- ====================================================================
CREATE INDEX idx_services_category ON services(category_id);
CREATE INDEX idx_services_key ON services(service_key);
CREATE INDEX idx_services_active ON services(is_active);
CREATE INDEX idx_service_docs_key ON service_documents(service_key);
CREATE INDEX idx_faqs_key ON service_faqs(service_key);
CREATE INDEX idx_enquiries_ref ON customer_enquiries(reference_id);
CREATE INDEX idx_enquiries_status ON customer_enquiries(status);
CREATE INDEX idx_enquiries_mobile ON customer_enquiries(mobile_number);
CREATE INDEX idx_enquiries_created ON customer_enquiries(created_at DESC);
CREATE INDEX idx_messages_enquiry ON enquiry_messages(enquiry_id);

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE enquiry_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE chatbot_settings ENABLE ROW LEVEL SECURITY;

-- Services & FAQs: Public read access, Admin full access
CREATE POLICY "Public can view active services" ON services
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admin full access on services" ON services
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Public can view service documents" ON service_documents
  FOR SELECT USING (true);

CREATE POLICY "Admin full access on service documents" ON service_documents
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Public can view published FAQs" ON service_faqs
  FOR SELECT USING (is_published = true);

CREATE POLICY "Admin full access on service FAQs" ON service_faqs
  FOR ALL USING (auth.role() = 'authenticated');

-- Customer Enquiries: Public can INSERT only, Admin can VIEW & UPDATE
CREATE POLICY "Public can insert enquiries" ON customer_enquiries
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admin full access on customer enquiries" ON customer_enquiries
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Public can insert messages" ON enquiry_messages
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admin full access on enquiry messages" ON enquiry_messages
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin full access on admin users" ON admin_users
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Public can view chatbot settings" ON chatbot_settings
  FOR SELECT USING (true);

CREATE POLICY "Admin full access on chatbot settings" ON chatbot_settings
  FOR ALL USING (auth.role() = 'authenticated');

-- ====================================================================
-- INITIAL SETTINGS SEED
-- ====================================================================
INSERT INTO chatbot_settings (setting_key, setting_value, description)
VALUES
  ('ai_model', '{"provider": "openai", "model": "gpt-4o-mini", "temperature": 0.3}'::jsonb, 'Default AI Model Provider'),
  ('business_info', '{"name": "NEXA DIGITAL SERVICES", "whatsapp": "+918086380373", "whatsapp_link": "https://wa.me/918086380373"}'::jsonb, 'Official Business Credentials');

-- ====================================================================
-- SEED DATA: ALL 43 SERVICES
-- ====================================================================

INSERT INTO services (
  service_key, category_id, category_name_en, category_name_ml, number,
  name_en, name_ml, description_en, description_ml, subservices,
  eligibility_en, eligibility_ml, procedure_en, procedure_ml,
  official_portal_name, official_portal_url, govt_fee, nexa_service_charge,
  processing_time_en, processing_time_ml, last_verified_date
) VALUES (
  'village-services', 'gov', 'Government Services', 'സർക്കാർ സേവനങ്ങൾ', 1,
  'Village Services (e-District)', 'വില്ലേജ് സർവീസുകൾ (ഇ-ഡിസ്ട്രിക്റ്റ്)', 'Official Kerala e-District revenue certificates issued through Village Offices and Taluk Offices.', 'വില്ലേജ് ഓഫീസ്, താലൂക്ക് ഓഫീസ് വഴി ഇ-ഡിസ്ട്രിക്റ്റ് പോർട്ടലിലൂടെ നൽകുന്ന ഔദ്യോഗിക റവന്യൂ സർട്ടിഫിക്കറ്റുകൾ.', '[{"id":"income","name_en":"Income Certificate","name_ml":"വരുമാന സർട്ടിഫിക്കറ്റ്"},{"id":"caste","name_en":"Caste / Community Certificate","name_ml":"ജാതി / കമ്മ്യൂണിറ്റി സർട്ടിഫിക്കറ്റ്"},{"id":"nativity","name_en":"Nativity Certificate","name_ml":"നേറ്റിവിറ്റി സർട്ടിഫിക്കറ്റ്"},{"id":"possession","name_en":"Possession Certificate","name_ml":"കൈവശാവകാശ സർട്ടിഫിക്കറ്റ്"},{"id":"non-creamy","name_en":"Non-Creamy Layer Certificate","name_ml":"നോൺ-ക്രീമിലെയർ സർട്ടിഫിക്കറ്റ്"},{"id":"location","name_en":"Location Certificate","name_ml":"ലൊക്കേഷൻ സർട്ടിഫിക്കറ്റ്"},{"id":"relationship","name_en":"Family Relationship Certificate","name_ml":"കുടുംബാംഗ സർട്ടിഫിക്കറ്റ്"},{"id":"dependency","name_en":"Dependency Certificate","name_ml":"ആശ്രിത സർട്ടിഫിക്കറ്റ്"}]'::jsonb,
  'Permanent or temporary resident of Kerala belonging to the respective Village jurisdiction.', 'കേരളത്തിലെ അതത് വില്ലേജ് പരിധിയിൽ സ്ഥിരമായോ താൽക്കാലികമായോ താമസിക്കുന്ന വ്യക്തികൾക്ക് അപേക്ഷിക്കാം.', '1. Document verification at Nexa Desk
2. Online application submission on Kerala e-District Portal
3. Village Officer / Revenue Inspector field verification
4. Digital certificate approval by Village Officer / Tahsildar
5. Download verified digital certificate with QR code.', '1. നെക്സ ഡെസ്കിൽ രേഖകൾ പരിശോധിക്കുന്നു
2. കേരള ഇ-ഡിസ്ട്രിക്റ്റ് പോർട്ടലിൽ അപേക്ഷ സമർപ്പിക്കുന്നു
3. വില്ലേജ് ഓഫീസർ / റവന്യൂ ഇൻസ്പെക്ടറുടെ പരിശോധന
4. ഡിജിറ്റൽ സർട്ടിഫിക്കറ്റ് അനുമതി
5. ക്യുആർ കോഡുള്ള സർട്ടിഫിക്കറ്റ് ഡൗൺലോഡ് ചെയ്ത് നൽകുന്നു.',
  'e-District Kerala Revenue Portal', 'https://edistrict.kerala.gov.in', 25, 30,
  '3 to 5 working days (subject to Village Officer schedule)', '3 മുതൽ 5 പ്രവൃത്തിദിനങ്ങൾ (വില്ലേജ് ഓഫീസറുടെ പരിശോധനയ്ക്കനുസരിച്ച്)', '2026-11-01'
);
INSERT INTO service_documents (service_key, name_en, name_ml, is_mandatory) VALUES ('village-services', 'Aadhaar Card copy', 'ആധാർ കാർഡ് കോപ്പി', true);
INSERT INTO service_documents (service_key, name_en, name_ml, is_mandatory) VALUES ('village-services', 'Ration Card copy', 'റേഷൻ കാർഡ് കോപ്പി', true);
INSERT INTO service_documents (service_key, name_en, name_ml, is_mandatory) VALUES ('village-services', 'Current Year Land Tax Receipt (for land certificates)', 'നടപ്പു വർഷത്തെ ഭൂനികുതി രസീത്', false);
INSERT INTO service_documents (service_key, name_en, name_ml, is_mandatory) VALUES ('village-services', 'Salary Certificate / Pension Book (for Income Certificate)', 'ശമ്പള സർട്ടിഫിക്കറ്റ് / പെൻഷൻ രേഖ (വരുമാനത്തിന്)', false);
INSERT INTO service_documents (service_key, name_en, name_ml, is_mandatory) VALUES ('village-services', 'SSLC Book copy (for Caste & Nativity)', 'എസ്.എസ്.എൽ.സി കോപ്പി (ജാതി, നേറ്റിവിറ്റിക്ക്)', false);
INSERT INTO service_documents (service_key, name_en, name_ml, is_mandatory) VALUES ('village-services', 'Passport size photograph', 'പാസ്പോർട്ട് സൈസ് ഫോട്ടോ', true);

INSERT INTO services (
  service_key, category_id, category_name_en, category_name_ml, number,
  name_en, name_ml, description_en, description_ml, subservices,
  eligibility_en, eligibility_ml, procedure_en, procedure_ml,
  official_portal_name, official_portal_url, govt_fee, nexa_service_charge,
  processing_time_en, processing_time_ml, last_verified_date
) VALUES (
  'panchayath-municipality-services', 'gov', 'Government Services', 'സർക്കാർ സേവനങ്ങൾ', 2,
  'Panchayath / Municipality Services', 'പഞ്ചായത്ത് / മുനിസിപ്പാലിറ്റി സർവീസുകൾ', 'Local Self Government (LSGD) civic services through K-SMART, Sevana and Sanchaya portals.', 'കെ-സ്മാർട്ട്, സേവന, സഞ്ചയ പോർട്ടലുകൾ വഴിയുള്ള തദ്ദേശ സ്വയംഭരണ സ്ഥാപന സേവനങ്ങൾ.', '[{"id":"birth-cert","name_en":"Birth Certificate Registration & Download","name_ml":"ജനന സർട്ടിഫിക്കറ്റ് രജിസ്ട്രേഷൻ & ഡൗൺലോഡ്"},{"id":"death-cert","name_en":"Death Certificate","name_ml":"മരണ സർട്ടിഫിക്കറ്റ്"},{"id":"marriage-reg","name_en":"Marriage Registration (Common & Hindu/Special)","name_ml":"വിവാഹ രജിസ്ട്രേഷൻ"},{"id":"trade-license","name_en":"D&O Trade License (New & Renewal)","name_ml":"ഡി & ഒ വ്യാപാര ലൈസൻസ്"},{"id":"property-tax","name_en":"Sanchaya Property / Building Tax","name_ml":"സഞ്ചയ കെട്ടിട നികുതി അടയ്ക്കൽ"},{"id":"ownership-cert","name_en":"Building Ownership Certificate","name_ml":"ഉടമസ്ഥാവകാശ സർട്ടിഫിക്കറ്റ്"}]'::jsonb,
  'Residents or property owners within the respective Grama Panchayath, Municipality, or Municipal Corporation in Kerala.', 'കേരളത്തിലെ ഗ്രാമപഞ്ചായത്ത്, മുനിസിപ്പാലിറ്റി അല്ലെങ്കിൽ കോർപ്പറേഷൻ പരിധിയിലെ താമസക്കാർ.', '1. File application on K-SMART / Sevana portal
2. Local body verification by Health Inspector / Revenue Officer
3. Secretary approval
4. Digital certificate issuance.', '1. കെ-സ്മാർട്ട് / സേവന പോർട്ടലിൽ അപേക്ഷ നൽകുന്നു
2. തദ്ദേശ ഉദ്യോഗസ്ഥരുടെ പരിശോധന
3. സെക്രട്ടറിയുടെ അംഗീകാരം
4. ഡിജിറ്റൽ സർട്ടിഫിക്കറ്റ് ലഭ്യമാക്കുന്നു.',
  'K-SMART LSGD Portal / Sevana', 'https://ksmart.lsgkerala.gov.in', 15, 50,
  '2 to 7 working days', '2 മുതൽ 7 പ്രവൃത്തിദിനങ്ങൾ', '2026-11-01'
);
INSERT INTO service_documents (service_key, name_en, name_ml, is_mandatory) VALUES ('panchayath-municipality-services', 'Hospital Discharge Card / Form 1 for Birth & Death', 'ആശുപത്രി ജനന/മരണ റിപ്പോർട്ട് / ഫോം 1', true);
INSERT INTO service_documents (service_key, name_en, name_ml, is_mandatory) VALUES ('panchayath-municipality-services', 'Aadhaar Card of Parents / Bride & Groom', 'മാതാപിതാക്കളുടെ / വധൂവരന്മാരുടെ ആധാർ കാർഡ്', true);
INSERT INTO service_documents (service_key, name_en, name_ml, is_mandatory) VALUES ('panchayath-municipality-services', 'Marriage Invitation & Wedding Photos (for Marriage)', 'വിവാഹ ക്ഷണക്കത്ത് & വിവാഹ ഫോട്ടോകൾ', false);
INSERT INTO service_documents (service_key, name_en, name_ml, is_mandatory) VALUES ('panchayath-municipality-services', 'Building Tax Assessment Number / Previous Receipt', 'കെട്ടിട നികുതി അസസ്സ്മെന്റ് നമ്പർ / മുൻ രസീത്', false);

INSERT INTO services (
  service_key, category_id, category_name_en, category_name_ml, number,
  name_en, name_ml, description_en, description_ml, subservices,
  eligibility_en, eligibility_ml, procedure_en, procedure_ml,
  official_portal_name, official_portal_url, govt_fee, nexa_service_charge,
  processing_time_en, processing_time_ml, last_verified_date
) VALUES (
  'registration-department-services', 'gov', 'Government Services', 'സർക്കാർ സേവനങ്ങൾ', 3,
  'Registration Department Services', 'രജിസ്ട്രേഷൻ വകുപ്പ് സർവീസുകൾ', 'Kerala Registration Department (PEARL) services including Encumbrance Certificates (Kudikadam) and certified copies.', 'കേരള രജിസ്ട്രേഷൻ വകുപ്പ് പേൾ (PEARL) പോർട്ടൽ വഴിയുള്ള കുടിക്കട സർട്ടിഫിക്കറ്റ്, പകർപ്പ് രേഖകൾ.', '[{"id":"ec-search","name_en":"Encumbrance Certificate (EC / കുടിക്കട സർട്ടിഫിക്കറ്റ്)","name_ml":"കുടിക്കട സർട്ടിഫിക്കറ്റ് (ഇ.സി)"},{"id":"certified-copy","name_en":"Certified Copy of Registered Deed (ആധാര പകർപ്പ്)","name_ml":"ആധാരത്തിന്റെ സാക്ഷ്യപ്പെടുത്തിയ പകർപ്പ്"},{"id":"fair-value","name_en":"Fair Value of Land Verification","name_ml":"ഭൂമിയുടെ ന്യായവില പരിശോധന"},{"id":"token-booking","name_en":"Sub-Registrar Office Online Token Booking","name_ml":"സബ് രജിസ്ട്രാർ ഓഫീസ് ടോക്കൺ ബുക്കിംഗ്"},{"id":"gehan-filing","name_en":"Gehan / Mortgage Filing Online","name_ml":"ഗെഹാൻ / ബാങ്ക് ബാധ്യത രജിസ്ട്രേഷൻ"}]'::jsonb,
  'Any citizen requiring verified land transactions history or registered deed documents in Kerala.', 'കേരളത്തിലെ രജിസ്റ്റർ ചെയ്ത ആധാരങ്ങളുടെ വിവരങ്ങൾ ആവശ്യമുള്ള ഏതൊരു പൗരനും.', '1. Search property records on PEARL portal
2. Submit online application with survey details
3. Government stamp & search fee payment online
4. Download digitally signed Encumbrance Certificate.', '1. പേൾ പോർട്ടലിൽ സർവേ വിവരങ്ങൾ നൽകി തെരയുന്നു
2. ഓൺലൈൻ അപേക്ഷ നൽകുന്നു
3. സർക്കാർ ഫീസ് അടയ്ക്കുന്നു
4. ഡിജിറ്റൽ ഒപ്പുള്ള കുടിക്കട സർട്ടിഫിക്കറ്റ് ലഭ്യമാക്കുന്നു.',
  'Kerala Registration Department (PEARL)', 'https://keralaregistration.gov.in', 110, 60,
  '1 to 3 working days', '1 മുതൽ 3 പ്രവൃത്തിദിനങ്ങൾ', '2026-11-01'
);
INSERT INTO service_documents (service_key, name_en, name_ml, is_mandatory) VALUES ('registration-department-services', 'Deed Number, Year, and Sub-Registrar Office Name', 'ആധാര നമ്പർ, വർഷം, സബ് രജിസ്ട്രാർ ഓഫീസ്', true);
INSERT INTO service_documents (service_key, name_en, name_ml, is_mandatory) VALUES ('registration-department-services', 'Survey Number, Sub-division, and Village Name', 'സർവേ നമ്പർ, സബ് ഡിവിഷൻ, വില്ലേജ് പേര്', true);
INSERT INTO service_documents (service_key, name_en, name_ml, is_mandatory) VALUES ('registration-department-services', 'Applicant ID proof (Aadhaar / Voter ID)', 'അപേക്ഷകന്റെ തിരിച്ചറിയൽ രേഖ (ആധാർ)', true);

INSERT INTO services (
  service_key, category_id, category_name_en, category_name_ml, number,
  name_en, name_ml, description_en, description_ml, subservices,
  eligibility_en, eligibility_ml, procedure_en, procedure_ml,
  official_portal_name, official_portal_url, govt_fee, nexa_service_charge,
  processing_time_en, processing_time_ml, last_verified_date
) VALUES (
  'police-department-services', 'gov', 'Government Services', 'സർക്കാർ സേവനങ്ങൾ', 4,
  'Police Department Services', 'പോലീസ് ഡിപ്പാർട്ട്മെന്റ് സർവീസുകൾ', 'Kerala Police Thuna Portal and Pol-App citizen facilitation services.', 'കേരള പോലീസ് തുണ (Thuna) പോർട്ടൽ, പോൽ-ആപ്പ് പൗര സേവനങ്ങൾ.', '[{"id":"pcc","name_en":"Police Clearance Certificate (PCC) for Employment / Abroad","name_ml":"പോലീസ് ക്ലിയറൻസ് സർട്ടിഫിക്കറ്റ് (PCC)"},{"id":"non-involvement","name_en":"Non-Involvement in Offences Certificate","name_ml":"ക്രിമിനൽ കേസുകളിൽ ഉൾപ്പെട്ടിട്ടില്ലെന്ന സർട്ടിഫിക്കറ്റ്"},{"id":"lost-article","name_en":"Lost Article Report (Passport, Phone, Documents)","name_ml":"സാധനങ്ങൾ നഷ്ടപ്പെട്ട റിപ്പോർട്ട്"},{"id":"tenant-verification","name_en":"Tenant / Domestic Help Verification","name_ml":"വാടകക്കാർ / സഹായികളുടെ വെരിഫിക്കേഷൻ"}]'::jsonb,
  'Residents of Kerala with clear judicial records needing verification for employment, higher studies, or licensing.', 'തൊഴിൽ, ഉന്നത വിദ്യാഭ്യാസം തുടങ്ങിയ ആവശ്യങ്ങൾക്കായി പോലീസ് സർട്ടിഫിക്കറ്റ് ആവശ്യമുള്ള കേരളത്തിലെ താമസക്കാർ.', '1. File application on Thuna portal
2. Local Police Station SHO verification and background check
3. Digital clearance certificate generated by District Police Chief / SHO.', '1. തുണ പോർട്ടലിൽ അപേക്ഷ നൽകുന്നു
2. ലോക്കൽ പോലീസ് സ്റ്റേഷൻ പരിശോധന
3. ജില്ലാ പോലീസ് മേധാവി / എസ്.എച്ച്.ഒ ഡിജിറ്റൽ സർട്ടിഫിക്കറ്റ് നൽകുന്നു.',
  'Kerala Police Thuna Portal', 'https://thuna.keralapolice.gov.in', 590, 80,
  '5 to 10 working days', '5 മുതൽ 10 പ്രവൃത്തിദിനങ്ങൾ', '2026-11-01'
);
INSERT INTO service_documents (service_key, name_en, name_ml, is_mandatory) VALUES ('police-department-services', 'Aadhaar Card copy', 'ആധാർ കാർഡ് കോപ്പി', true);
INSERT INTO service_documents (service_key, name_en, name_ml, is_mandatory) VALUES ('police-department-services', 'Passport copy (for foreign travel/job PCC)', 'പാസ്പോർട്ട് കോപ്പി (വിദേശ ആവശ്യങ്ങൾക്ക്)', false);
INSERT INTO service_documents (service_key, name_en, name_ml, is_mandatory) VALUES ('police-department-services', 'Passport size photograph', 'പാസ്പോർട്ട് സൈസ് ഫോട്ടോ', true);
INSERT INTO service_documents (service_key, name_en, name_ml, is_mandatory) VALUES ('police-department-services', 'Authority Letter / Employer Letter stating requirement', 'ആവശ്യകത വ്യക്തമാക്കുന്ന തൊഴിലുടമയുടെ കത്ത്', true);

INSERT INTO services (
  service_key, category_id, category_name_en, category_name_ml, number,
  name_en, name_ml, description_en, description_ml, subservices,
  eligibility_en, eligibility_ml, procedure_en, procedure_ml,
  official_portal_name, official_portal_url, govt_fee, nexa_service_charge,
  processing_time_en, processing_time_ml, last_verified_date
) VALUES (
  'cm-grievance-cmdrf', 'gov', 'Government Services', 'സർക്കാർ സേവനങ്ങൾ', 5,
  'CM''s Grievance Redressal / CMDRF', 'മുഖ്യമന്ത്രിയുടെ പരാതി പരിഹാരം / CMDRF', 'Chief Minister''s Distress Relief Fund (CMDRF) medical and calamity assistance & CMO grievance petition submission.', 'മുഖ്യമന്ത്രിയുടെ ദുരിതാശ്വാസ നിധി (CMDRF) സഹായം, മുഖ്യമന്ത്രിയുടെ പരാതി പരിഹാര സെല്ലിൽ അപേക്ഷ സമർപ്പിക്കൽ.', '[{"id":"cmdrf-medical","name_en":"CMDRF Medical Treatment Financial Aid","name_ml":"CMDRF ചികിത്സാ ധനസഹായം"},{"id":"cmdrf-calamity","name_en":"Natural Calamity / Accident Relief Aid","name_ml":"പ്രകൃതിദുരന്ത / അപകട ദുരിതാശ്വാസം"},{"id":"cmo-grievance","name_en":"CMO Direct Grievance Petition Filing","name_ml":"മുഖ്യമന്ത്രിക്കുള്ള പരാതി സമർപ്പിക്കൽ"},{"id":"cmdrf-status","name_en":"Track CMDRF Petition Status","name_ml":"അപേക്ഷയുടെ സ്റ്റാറ്റസ് പരിശോധിക്കൽ"}]'::jsonb,
  'Residents of Kerala facing grave medical illness or calamity with annual family income within government limits.', 'ഗുരുതര രോഗങ്ങൾക്ക് ചികിത്സ തേടുന്ന, വരുമാന പരിധിയിലുള്ള കേരളത്തിലെ കുടുംബങ്ങൾ.', '1. Upload medical certificate, income certificate, and bank details on CMDRF portal
2. Village Officer & Taluk Tahsildar revenue verification
3. District Collectorate sanction
4. Direct Benefit Transfer (DBT) to applicant''s bank account.', '1. മെഡിക്കൽ രേഖകളും വരുമാന സർട്ടിഫിക്കറ്റും ബാങ്ക് വിവരങ്ങളും പോർട്ടലിൽ അപ്‌ലോഡ് ചെയ്യുന്നു
2. വില്ലേജ് ഓഫീസറുടെയും തഹസിൽദാരുടെയും പരിശോധന
3. കളക്ടറേറ്റ് അംഗീകാരം
4. ബാങ്ക് അക്കൗണ്ടിലേക്ക് നേരിട്ട് തുക എത്തുന്നു.',
  'CMDRF Kerala Portal', 'https://cmdrf.kerala.gov.in', 0, 40,
  '15 to 30 working days', '15 മുതൽ 30 പ്രവൃത്തിദിനങ്ങൾ', '2026-11-01'
);
INSERT INTO service_documents (service_key, name_en, name_ml, is_mandatory) VALUES ('cm-grievance-cmdrf', 'Medical Certificate in prescribed format from Govt Hospital Assistant Surgeon', 'സർക്കാർ അസിസ്റ്റന്റ് സർജന്റെ ചികിത്സാ സർട്ടിഫിക്കറ്റ്', true);
INSERT INTO service_documents (service_key, name_en, name_ml, is_mandatory) VALUES ('cm-grievance-cmdrf', 'Treatment Cost Estimation & Medical Bills', 'ചികിത്സാ ചെലവ് എസ്റ്റിമേറ്റും ബില്ലുകളും', true);
INSERT INTO service_documents (service_key, name_en, name_ml, is_mandatory) VALUES ('cm-grievance-cmdrf', 'Income Certificate from Village Officer', 'വില്ലേജ് ഓഫീസിൽ നിന്നുള്ള വരുമാന സർട്ടിഫിക്കറ്റ്', true);
INSERT INTO service_documents (service_key, name_en, name_ml, is_mandatory) VALUES ('cm-grievance-cmdrf', 'Ration Card copy', 'റേഷൻ കാർഡ് കോപ്പി', true);
INSERT INTO service_documents (service_key, name_en, name_ml, is_mandatory) VALUES ('cm-grievance-cmdrf', 'Applicant / Beneficiary Bank Passbook copy with IFSC', 'ബാങ്ക് പാസ്ബുക്ക് കോപ്പി (IFSC സഹിതം)', true);
INSERT INTO service_documents (service_key, name_en, name_ml, is_mandatory) VALUES ('cm-grievance-cmdrf', 'Aadhaar Card copy', 'ആധാർ കാർഡ് കോപ്പി', true);

INSERT INTO services (
  service_key, category_id, category_name_en, category_name_ml, number,
  name_en, name_ml, description_en, description_ml, subservices,
  eligibility_en, eligibility_ml, procedure_en, procedure_ml,
  official_portal_name, official_portal_url, govt_fee, nexa_service_charge,
  processing_time_en, processing_time_ml, last_verified_date
) VALUES (
  'welfare-registrations-epayments', 'gov', 'Government Services', 'സർക്കാർ സേവനങ്ങൾ', 6,
  'Welfare Registrations and E-Payments', 'ക്ഷേമനിധി രജിസ്ട്രേഷൻ & ഇ-പേയ്മെന്റുകൾ', 'Kerala Labour Welfare Fund Boards online member registration, monthly fee dues e-payments and welfare benefits.', 'വിവിധ തൊഴിലാളി ക്ഷേമനിധി ബോർഡുകളിലെ ഓൺലൈൻ അംഗത്വം, അംശദായം അടയ്ക്കൽ, ആനുകൂല്യ അപേക്ഷകൾ.', '[{"id":"building-workers","name_en":"Building & Construction Workers Welfare (KBOCWWB)","name_ml":"കെട്ടിട നിർമ്മാണ തൊഴിലാളി ക്ഷേമനിധി"},{"id":"motor-workers","name_en":"Motor Transport Workers Welfare Board","name_ml":"മോട്ടോർ തൊഴിലാളി ക്ഷേമനിധി"},{"id":"tailoring-workers","name_en":"Tailoring Workers Welfare Board","name_ml":"തയ്യൽ തൊഴിലാളി ക്ഷേമനിധി"},{"id":"agricultural-workers","name_en":"Agricultural Workers Welfare Board","name_ml":"കർഷക തൊഴിലാളി ക്ഷേമനിധി"},{"id":"monthly-contribution","name_en":"Online Monthly Contribution E-Payment","name_ml":"മാസാന്ത അംശദായം ഓൺലൈനായി അടയ്ക്കൽ"}]'::jsonb,
  'Enrolled workers in Kerala welfare fund boards across construction, transport, tailoring, and agricultural sectors.', 'കേരളത്തിലെ വിവിധ മേഖലകളിലെ ക്ഷേമനിധി ബോർഡുകളിൽ അംഗങ്ങളായ തൊഴിലാളികൾ.', '1. Verify member account and pending dues
2. Online contribution payment on board portal
3. Instant e-receipt and passbook endorsement generation.', '1. അംഗത്വ നമ്പറും കുടിശ്ശികയും പരിശോധിക്കുന്നു
2. ഓൺലൈനായി അംശദായം അടയ്ക്കുന്നു
3. തൽക്ഷണം ഇ-രസീത് ലഭ്യമാക്കുന്നു.',
  'Kerala Welfare Fund Portals', 'https://welfarefund.kerala.gov.in', 0, 30,
  'Instant e-receipt upon payment', 'തത്സമയ ഇ-രസീത് ലഭിക്കുന്നു', '2026-11-01'
);
INSERT INTO service_documents (service_key, name_en, name_ml, is_mandatory) VALUES ('welfare-registrations-epayments', 'Welfare Passbook / Member ID Number', 'ക്ഷേമനിധി പാസ്ബുക്ക് / മെമ്പർ നമ്പർ', true);
INSERT INTO service_documents (service_key, name_en, name_ml, is_mandatory) VALUES ('welfare-registrations-epayments', 'Aadhaar Card copy', 'ആധാർ കാർഡ് കോപ്പി', true);
INSERT INTO service_documents (service_key, name_en, name_ml, is_mandatory) VALUES ('welfare-registrations-epayments', 'Bank Passbook with IFSC', 'ബാങ്ക് പാസ്ബുക്ക് കോപ്പി', true);
INSERT INTO service_documents (service_key, name_en, name_ml, is_mandatory) VALUES ('welfare-registrations-epayments', 'Trade Union / Employer Certificate for new registration', 'തൊഴിൽ സാക്ഷ്യപത്രം (പുതിയ രജിസ്ട്രേഷന്)', false);

INSERT INTO services (
  service_key, category_id, category_name_en, category_name_ml, number,
  name_en, name_ml, description_en, description_ml, subservices,
  eligibility_en, eligibility_ml, procedure_en, procedure_ml,
  official_portal_name, official_portal_url, govt_fee, nexa_service_charge,
  processing_time_en, processing_time_ml, last_verified_date
) VALUES (
  'labour-department-services', 'gov', 'Government Services', 'സർക്കാർ സേവനങ്ങൾ', 7,
  'Labour Department Services', 'തൊഴിൽ വകുപ്പ് സർവീസുകൾ', 'Kerala Labour Department LCAS portal services, Shops and Commercial Establishments registration & renewals.', 'തൊഴിൽ വകുപ്പ് LCAS പോർട്ടൽ വഴിയുള്ള വ്യാപാര സ്ഥാപന രജിസ്ട്രേഷൻ, റിന്യൂവൽ, തൊഴിലാളി സേവനങ്ങൾ.', '[{"id":"shops-registration","name_en":"Shops & Commercial Establishments Registration (Form A)","name_ml":"കടകളുടെയും വാണിജ്യ സ്ഥാപനങ്ങളുടെയും രജിസ്ട്രേഷൻ"},{"id":"shops-renewal","name_en":"Annual Renewal of Shop License","name_ml":"ഷോപ്പ് ലൈസൻസ് വാർഷിക പുതുക്കൽ"},{"id":"migrant-awaz","name_en":"Inter-state Migrant Workers AWAZ Registration","name_ml":"അതിഥി തൊഴിലാളി ആവാസ് (AWAZ) രജിസ്ട്രേഷൻ"},{"id":"labour-complaint","name_en":"Online Wage / Labour Dispute Complaint","name_ml":"തൊഴിൽ തർക്ക / വേതന പരാതികൾ"}]'::jsonb,
  'Business owners, commercial establishments, and registered employers in Kerala.', 'കേരളത്തിലെ കടകൾ, വാണിജ്യ സ്ഥാപനങ്ങൾ എന്നിവ നടത്തുന്ന വ്യാപാരികൾ.', '1. Online filing on LCAS Kerala Labour portal
2. Verification by Assistant Labour Officer (ALO)
3. Certificate download.', '1. LCAS പോർട്ടലിൽ അപേക്ഷ നൽകുന്നു
2. അസിസ്റ്റന്റ് ലേബർ ഓഫീസറുടെ പരിശോധന
3. ലൈസൻസ് സർട്ടിഫിക്കറ്റ് ലഭ്യമാക്കുന്നു.',
  'Kerala Labour Department LCAS Portal', 'https://lcas.lc.kerala.gov.in', 100, 100,
  '5 to 10 working days', '5 മുതൽ 10 പ്രവൃത്തിദിനങ്ങൾ', '2026-11-01'
);
INSERT INTO service_documents (service_key, name_en, name_ml, is_mandatory) VALUES ('labour-department-services', 'Rental Agreement / Ownership Tax receipt of establishment', 'സ്ഥാപനത്തിന്റെ വാടകക്കരാർ / ഉടമസ്ഥാവകാശ രസീത്', true);
INSERT INTO service_documents (service_key, name_en, name_ml, is_mandatory) VALUES ('labour-department-services', 'PAN and Aadhaar of Proprietor / Partners', 'ഉടമയുടെ പാൻ, ആധാർ കോപ്പികൾ', true);
INSERT INTO service_documents (service_key, name_en, name_ml, is_mandatory) VALUES ('labour-department-services', 'Employee details (Name, Age, Designation)', 'തൊഴിലാളികളുടെ വിവരങ്ങൾ', false);
INSERT INTO service_documents (service_key, name_en, name_ml, is_mandatory) VALUES ('labour-department-services', 'Passport size photograph of employer', 'തൊഴിലുടമയുടെ ഫോട്ടോ', true);

INSERT INTO services (
  service_key, category_id, category_name_en, category_name_ml, number,
  name_en, name_ml, description_en, description_ml, subservices,
  eligibility_en, eligibility_ml, procedure_en, procedure_ml,
  official_portal_name, official_portal_url, govt_fee, nexa_service_charge,
  processing_time_en, processing_time_ml, last_verified_date
) VALUES (
  'passport-services', 'identity', 'Identity & Document Services', 'തിരിച്ചറിയൽ രേഖാ സേവനങ്ങൾ', 8,
  'Passport Services', 'പാസ്പോർട്ട് സർവീസുകൾ', 'Complete Passport Seva facilitation for Fresh, Renewal, Tatkaal, Minor passport and PSK appointment slots.', 'പുതിയ പാസ്പോർട്ട്, റിന്യൂവൽ, തത്കാൽ, മൈനർ പാസ്പോർട്ട്, PSK അപ്പോയിന്റ്മെന്റ് ബുക്കിംഗ് സേവനങ്ങൾ.', '[{"id":"fresh","name_en":"Fresh Indian Passport Application","name_ml":"പുതിയ പാസ്പോർട്ട് അപേക്ഷ"},{"id":"renewal","name_en":"Passport Renewal / Re-issue (Validity Expired / Exhausted Pages)","name_ml":"പാസ്പോർട്ട് പുതുക്കൽ / റീ-ഇഷ്യൂ"},{"id":"tatkaal","name_en":"Tatkaal Emergency Fast-Track Passport","name_ml":"തത്കാൽ അടിയന്തര പാസ്പോർട്ട്"},{"id":"minor","name_en":"Minor Child Passport (Below 18 Years)","name_ml":"കുട്ടികളുടെ (മൈനർ) പാസ്പോർട്ട്"},{"id":"appointment","name_en":"PSK / POPSK Slot Booking & Rescheduling","name_ml":"പാസ്പോർട്ട് സേവാ കേന്ദ്രം അപ്പോയിന്റ്മെന്റ് സ്ലോട്ട്"}]'::jsonb,
  'Indian citizens residing in Kerala.', 'കേരളത്തിൽ താമസിക്കുന്ന ഇന്ത്യൻ പൗരന്മാർക്ക്.', '1. Form filing on Passport Seva Online Portal
2. Online government fee payment & PSK slot confirmation
3. Citizen visits PSK (Ernakulam, Kozhikode, Malappuram, Kollam, Thiruvananthapuram, or POPSK)
4. Police verification at local police station
5. Passport delivered by Speed Post.', '1. പാസ്പോർട്ട് പോർട്ടലിൽ അപേക്ഷ സമർപ്പിക്കുന്നു
2. സർക്കാർ ഫീസ് അടച്ച് PSK സ്ലോട്ട് ബുക്ക് ചെയ്യുന്നു
3. അപേക്ഷകൻ നേരിട്ട് PSK യിൽ ഹാജരാകുന്നു
4. പോലീസ് വെരിഫിക്കേഷൻ പൂർത്തിയാകുന്നു
5. സ്പീഡ് പോസ്റ്റിൽ പാസ്പോർട്ട് വീട്ടിലെത്തുന്നു.',
  'Passport Seva Portal (Ministry of External Affairs)', 'https://passportindia.gov.in', 1500, 150,
  'Normal: 15-20 days | Tatkaal: 3-5 days (subject to Police Verification)', 'സാധാരണ: 15-20 ദിവസങ്ങൾ | തത്കാൽ: 3-5 ദിവസങ്ങൾ', '2026-11-01'
);
INSERT INTO service_documents (service_key, name_en, name_ml, is_mandatory) VALUES ('passport-services', 'Aadhaar Card (Name, DOB & Address must be accurate)', 'ആധാർ കാർഡ് (പേരും ജനനത്തീയതിയും കൃത്യമായിരിക്കണം)', true);
INSERT INTO service_documents (service_key, name_en, name_ml, is_mandatory) VALUES ('passport-services', 'Birth Certificate / SSLC Certificate (Age proof)', 'ജനന സർട്ടിഫിക്കറ്റ് / എസ്.എസ്.എൽ.സി ബുക്ക്', true);
INSERT INTO service_documents (service_key, name_en, name_ml, is_mandatory) VALUES ('passport-services', 'Old Passport original + front/back photocopies (for Renewal)', 'പഴയ പാസ്പോർട്ട് കോപ്പി (റിന്യൂവലിന്)', false);
INSERT INTO service_documents (service_key, name_en, name_ml, is_mandatory) VALUES ('passport-services', 'Parents'' Passports & Annexure D (for Minor)', 'മാതാപിതാക്കളുടെ പാസ്പോർട്ട്, അനെക്സ്ചർ ഡി (മൈനറിന്)', false);
INSERT INTO service_documents (service_key, name_en, name_ml, is_mandatory) VALUES ('passport-services', 'Active Bank Passbook with photo / Voter ID (Additional address proof)', 'ബാങ്ക് പാസ്ബുക്ക് / വോട്ടർ ഐഡി', false);

INSERT INTO services (
  service_key, category_id, category_name_en, category_name_ml, number,
  name_en, name_ml, description_en, description_ml, subservices,
  eligibility_en, eligibility_ml, procedure_en, procedure_ml,
  official_portal_name, official_portal_url, govt_fee, nexa_service_charge,
  processing_time_en, processing_time_ml, last_verified_date
) VALUES (
  'pan-card-services', 'identity', 'Identity & Document Services', 'തിരിച്ചറിയൽ രേഖാ സേവനങ്ങൾ', 9,
  'PAN Card Services', 'പാൻ കാർഡ് സർവീസുകൾ', 'Protean (NSDL) and UTIITSL PAN card facilitation: New PAN, Corrections, Reprint and Linking assistance.', 'പുതിയ പാൻ കാർഡ്, തിരുത്തലുകൾ, നഷ്ടപ്പെട്ട പാൻ കാർഡ് വീണ്ടെടുക്കൽ, പാൻ സർവീസുകൾ.', '[{"id":"new-pan","name_en":"New PAN Card (Form 49A)","name_ml":"പുതിയ പാൻ കാർഡ് അപേക്ഷ"},{"id":"correction","name_en":"PAN Card Correction / Name, DOB & Father Name Update","name_ml":"പാൻ കാർഡ് തിരുത്തലുകൾ"},{"id":"reprint","name_en":"Reprint / Lost Physical PAN Card Replacement","name_ml":"പാൻ കാർഡ് റീപ്രിന്റ്"},{"id":"pan-status","name_en":"Check PAN Application & Linking Status","name_ml":"പാൻ സ്റ്റാറ്റസ് പരിശോധിക്കൽ"}]'::jsonb,
  'Any individual, minor (represented by parent), or business entity requiring Permanent Account Number.', 'ഇന്ത്യൻ പൗരന്മാർ, മൈനർമാർ, ബിസിനസ്സ് സ്ഥാപനങ്ങൾ.', '1. Online submission on NSDL / UTIITSL portal
2. Identity & address verification
3. e-PAN delivered via email in 2-4 days
4. Physical laminated PVC PAN card dispatched via Speed Post.', '1. NSDL / UTIITSL പോർട്ടലിൽ അപേക്ഷ സമർപ്പിക്കുന്നു
2. രേഖകൾ പരിശോധിക്കുന്നു
3. 2-4 ദിവസത്തിനകം ഇ-പാൻ ഇമെയിലിൽ ലഭിക്കുന്നു
4. ഫിസിക്കൽ പാൻ കാർഡ് സ്പീഡ് പോസ്റ്റിൽ ലഭിക്കുന്നു.',
  'Protean eGov / NSDL PAN Portal', 'https://onlineservices.nsdl.com', 107, 60,
  'e-PAN: 2 to 4 working days | Physical Card: 10 to 14 days', 'ഇ-പാൻ: 2-4 ദിവസങ്ങൾ | ഫിസിക്കൽ കാർഡ്: 10-14 ദിവസങ്ങൾ', '2026-11-01'
);
INSERT INTO service_documents (service_key, name_en, name_ml, is_mandatory) VALUES ('pan-card-services', 'Aadhaar Card copy (Demographic details must match)', 'ആധാർ കാർഡ് കോപ്പി', true);
INSERT INTO service_documents (service_key, name_en, name_ml, is_mandatory) VALUES ('pan-card-services', 'Two recent passport size color photographs (3.5 x 2.5 cm)', '2 പാസ്പോർട്ട് സൈസ് കളർ ഫോട്ടോകൾ', true);
INSERT INTO service_documents (service_key, name_en, name_ml, is_mandatory) VALUES ('pan-card-services', 'Applicant signature copy on white paper', 'വെള്ള പേപ്പറിൽ ഒപ്പ്', true);
INSERT INTO service_documents (service_key, name_en, name_ml, is_mandatory) VALUES ('pan-card-services', 'Copy of existing PAN card (for correction or reprint)', 'നിലവിലെ പാൻ കോപ്പി (തിരുത്തലിന്)', false);

INSERT INTO services (
  service_key, category_id, category_name_en, category_name_ml, number,
  name_en, name_ml, description_en, description_ml, subservices,
  eligibility_en, eligibility_ml, procedure_en, procedure_ml,
  official_portal_name, official_portal_url, govt_fee, nexa_service_charge,
  processing_time_en, processing_time_ml, last_verified_date
) VALUES (
  'ration-card-services', 'identity', 'Identity & Document Services', 'തിരിച്ചറിയൽ രേഖാ സേവനങ്ങൾ', 10,
  'Ration Card Services', 'റേഷൻ കാർഡ് സർവീസുകൾ', 'Kerala Civil Supplies Department e-CivilSupplies portal assistance for all ration card services.', 'സിവിൽ സപ്ലൈസ് വകുപ്പ് പോർട്ടൽ വഴിയുള്ള പുതിയ റേഷൻ കാർഡ്, അംഗങ്ങളെ ചേർക്കൽ, തിരുത്തലുകൾ.', '[{"id":"new-card","name_en":"New Ration Card Application","name_ml":"പുതിയ റേഷൻ കാർഡ് അപേക്ഷ"},{"id":"add-member","name_en":"Add Family Member / Child Inclusion","name_ml":"കുടുംബാംഗത്തെ ചേർക്കൽ"},{"id":"remove-member","name_en":"Remove Member / Reduction Certificate for Marriage/Death","name_ml":"അംഗത്തെ ഒഴിവാക്കൽ (റിഡക്ഷൻ സർട്ടിഫിക്കറ്റ്)"},{"id":"address-change","name_en":"Address Change / Fair Price Shop (ARD) Transfer","name_ml":"റേഷൻ കട മാറ്റൽ / വിലാസം മാറ്റൽ"},{"id":"correction","name_en":"Name / Age / Relation Correction in Card","name_ml":"പേര് / വിവരങ്ങൾ തിരുത്തൽ"},{"id":"category-change","name_en":"Category Reclassification (Non-Priority to Priority BPL)","name_ml":"മുൻഗണനാ വിഭാഗത്തിലേക്ക് മാറ്റൽ (BPL)"}]'::jsonb,
  'Families residing in Kerala holding valid domicile proof.', 'കേരളത്തിൽ താമസിക്കുന്ന കുടുംബങ്ങൾക്ക്.', '1. Online filing on e-CivilSupplies Kerala portal
2. Verification by Taluk Supply Officer (TSO) / Rationing Inspector
3. Approval and digital card generation.', '1. ഇ-സിവിൽ സപ്ലൈസ് പോർട്ടലിൽ അപേക്ഷ സമർപ്പിക്കുന്നു
2. താലൂക്ക് സപ്ലൈ ഓഫീസറുടെ (TSO) പരിശോധന
3. കാർഡ് അംഗീകരിക്കപ്പെട്ട് ലഭ്യമാകുന്നു.',
  'Kerala Civil Supplies Portal (e-CivilSupplies)', 'https://ecitizen.civilsupplieskerala.gov.in', 0, 50,
  '7 to 15 working days', '7 മുതൽ 15 പ്രവൃത്തിദിനങ്ങൾ', '2026-11-01'
);
INSERT INTO service_documents (service_key, name_en, name_ml, is_mandatory) VALUES ('ration-card-services', 'Aadhaar cards of all family members to be included', 'എല്ലാ കുടുംബാംഗങ്ങളുടെയും ആധാർ കാർഡുകൾ', true);
INSERT INTO service_documents (service_key, name_en, name_ml, is_mandatory) VALUES ('ration-card-services', 'Birth Certificate of children (for addition)', 'കുട്ടികളുടെ ജനന സർട്ടിഫിക്കറ്റ്', false);
INSERT INTO service_documents (service_key, name_en, name_ml, is_mandatory) VALUES ('ration-card-services', 'Surrender / Reduction Certificate from previous card', 'മുൻ കാർഡിൽ നിന്നുള്ള റിഡക്ഷൻ സർട്ടിഫിക്കറ്റ്', false);
INSERT INTO service_documents (service_key, name_en, name_ml, is_mandatory) VALUES ('ration-card-services', 'House Tax Receipt / Electricity Bill / Ownership Proof', 'കെട്ടിട നികുതി രസീത് / കറന്റ് ബിൽ', true);
INSERT INTO service_documents (service_key, name_en, name_ml, is_mandatory) VALUES ('ration-card-services', 'Income Certificate from Village Officer (for Priority BPL request)', 'വരുമാന സർട്ടിഫിക്കറ്റ് (ബി.പി.എൽ വിഭാഗത്തിന്)', false);

INSERT INTO services (
  service_key, category_id, category_name_en, category_name_ml, number,
  name_en, name_ml, description_en, description_ml, subservices,
  eligibility_en, eligibility_ml, procedure_en, procedure_ml,
  official_portal_name, official_portal_url, govt_fee, nexa_service_charge,
  processing_time_en, processing_time_ml, last_verified_date
) VALUES (
  'voter-id-services', 'identity', 'Identity & Document Services', 'തിരിച്ചറിയൽ രേഖാ സേവനങ്ങൾ', 11,
  'Voter ID Services', 'വോട്ടർ ഐഡി സർവീസുകൾ', 'Election Commission of India (ECI) Voter Service Portal assistance for Form 6, 6A, 7, 8 and e-EPIC download.', 'കേന്ദ്ര തെരഞ്ഞെടുപ്പ് കമ്മീഷന്റെ വോട്ടർ പോർട്ടൽ വഴിയുള്ള പുതിയ വോട്ടർ ഐഡി, തിരുത്തലുകൾ, ഇ-എപിക് ഡൗൺലോഡ്.', '[{"id":"new-voter","name_en":"New Voter Registration (Form 6 - 18+ Citizens)","name_ml":"പുതിയ വോട്ടർ രജിസ്ട്രേഷൻ (ഫോം 6)"},{"id":"correction","name_en":"Correction of Entries & Photo Update (Form 8)","name_ml":"വോട്ടർ കാർഡിലെ തിരുത്തലുകൾ (ഫോം 8)"},{"id":"shifting","name_en":"Shifting of Residence / Assembly Constituency Transfer","name_ml":"താമസസ്ഥലം മാറ്റൽ / മണ്ഡലം മാറ്റൽ"},{"id":"replacement","name_en":"Replacement Voter ID Card (Lost/Damaged Card)","name_ml":"നഷ്ടപ്പെട്ട വോട്ടർ കാർഡിന് പകരം പുതിയ കാർഡ്"},{"id":"nri-voter","name_en":"Overseas (NRI) Voter Registration (Form 6A)","name_ml":"പ്രവാസി വോട്ടർ രജിസ്ട്രേഷൻ (ഫോം 6A)"},{"id":"download","name_en":"Download Digital e-EPIC with QR Code","name_ml":"ഡിജിറ്റൽ ഇ-എപിക് (e-EPIC) ഡൗൺലോഡ്"}]'::jsonb,
  'Indian citizens who have reached or will reach 18 years of age on qualifying dates.', '18 വയസ്സ് തികഞ്ഞ ഇന്ത്യൻ പൗരന്മാർക്ക്.', '1. Form submission on ECI Voters Portal
2. Booth Level Officer (BLO) field verification
3. Electoral Registration Officer (ERO) approval
4. Speed Post delivery of EPIC card.', '1. വോട്ടേഴ്സ് പോർട്ടലിൽ അപേക്ഷ നൽകുന്നു
2. ബി.എൽ.ഒ (BLO) വീടുകളിലെത്തി പരിശോധിക്കുന്നു
3. ഇ.ആർ.ഒ (ERO) അംഗീകരിക്കുന്നു
4. പുതിയ വോട്ടർ കാർഡ് തപാലിൽ ലഭിക്കുന്നു.',
  'Election Commission of India Voters Service Portal', 'https://voters.eci.gov.in', 0, 40,
  '15 to 30 working days', '15 മുതൽ 30 പ്രവൃത്തിദിനങ്ങൾ', '2026-11-01'
);
INSERT INTO service_documents (service_key, name_en, name_ml, is_mandatory) VALUES ('voter-id-services', 'Age Proof: SSLC Book / Birth Certificate / Passport / Driving Licence', 'പ്രായം തെളിയിക്കുന്ന രേഖ (എസ്.എസ്.എൽ.സി / ജനന സർട്ടിഫിക്കറ്റ്)', true);
INSERT INTO service_documents (service_key, name_en, name_ml, is_mandatory) VALUES ('voter-id-services', 'Address Proof: Aadhaar / Current Electricity or Water Bill / Ration Card', 'മേൽവിലാസം തെളിയിക്കുന്ന രേഖ (ആധാർ / കറന്റ് ബിൽ)', true);
INSERT INTO service_documents (service_key, name_en, name_ml, is_mandatory) VALUES ('voter-id-services', 'Recent Passport size color photo', 'പാസ്പോർട്ട് സൈസ് ഫോട്ടോ', true);
INSERT INTO service_documents (service_key, name_en, name_ml, is_mandatory) VALUES ('voter-id-services', 'Existing Voter ID number of family member (for Polling Booth mapping)', 'കുടുംബത്തിലെ അംഗത്തിന്റെ വോട്ടർ ഐഡി നമ്പർ', false);

INSERT INTO services (
  service_key, category_id, category_name_en, category_name_ml, number,
  name_en, name_ml, description_en, description_ml, subservices,
  eligibility_en, eligibility_ml, procedure_en, procedure_ml,
  official_portal_name, official_portal_url, govt_fee, nexa_service_charge,
  processing_time_en, processing_time_ml, last_verified_date
) VALUES (
  'e-shram-card-services', 'identity', 'Identity & Document Services', 'തിരിച്ചറിയൽ രേഖാ സേവനങ്ങൾ', 12,
  'E-Shram Card Services', 'ഇ-ശ്രം കാർഡ് സർവീസുകൾ', 'Ministry of Labour & Employment unorganized worker registration, 12-digit UAN card creation and update.', 'അസംഘടിത തൊഴിലാളികൾക്കുള്ള ദേശീയ ഇ-ശ്രം (E-Shram) കാർഡ് രജിസ്ട്രേഷനും അപ്‌ഡേഷനും.', '[{"id":"new-registration","name_en":"New E-Shram Registration & UAN Card Generation","name_ml":"പുതിയ ഇ-ശ്രം രജിസ്ട്രേഷൻ"},{"id":"profile-update","name_en":"Update Occupation, Skills, Address & Bank Account","name_ml":"തൊഴിൽ, ബാങ്ക് വിവരങ്ങൾ മാറ്റൽ"},{"id":"download","name_en":"Download / Reprint Laminated E-Shram Card","name_ml":"ഇ-ശ്രം കാർഡ് ഡൗൺലോഡ്"}]'::jsonb,
  'Unorganized workers aged 16 to 59 years, not covered under EPFO or ESIC.', '16 നും 59 നും ഇടയിൽ പ്രായമുള്ള, ഇ.പി.എഫ് അല്ലെങ്കിൽ ഇ.എസ്.ഐ ഇല്ലാത്ത അസംഘടിത തൊഴിലാളികൾ.', '1. Aadhaar OTP authentication
2. Profile & occupation registration
3. Instant 12-digit Universal Account Number (UAN) card generation.', '1. ആധാർ ഒ.ടി.പി പരിശോധന
2. തൊഴിൽ, ബാങ്ക് വിവരങ്ങൾ രജിസ്റ്റർ ചെയ്യുന്നു
3. തൽക്ഷണം 12 അക്ക UAN ഇ-ശ്രം കാർഡ് ലഭിക്കുന്നു.',
  'National e-Shram Portal (Ministry of Labour)', 'https://eshram.gov.in', 0, 30,
  'Instant on successful OTP verification', 'ഒ.ടി.പി വഴി തത്സമയം കാർഡ് ലഭിക്കുന്നു', '2026-11-01'
);
INSERT INTO service_documents (service_key, name_en, name_ml, is_mandatory) VALUES ('e-shram-card-services', 'Aadhaar Card linked to active mobile phone for OTP', 'മൊബൈൽ ലിങ്ക് ചെയ്ത ആധാർ കാർഡ്', true);
INSERT INTO service_documents (service_key, name_en, name_ml, is_mandatory) VALUES ('e-shram-card-services', 'Active Savings Bank Account Passbook with IFSC', 'ബാങ്ക് അക്കൗണ്ട് വിവരങ്ങൾ (IFSC സഹിതം)', true);
INSERT INTO service_documents (service_key, name_en, name_ml, is_mandatory) VALUES ('e-shram-card-services', 'Nominee details (Name, Relation, Age)', 'നോമിനിയുടെ വിവരങ്ങൾ', true);

INSERT INTO services (
  service_key, category_id, category_name_en, category_name_ml, number,
  name_en, name_ml, description_en, description_ml, subservices,
  eligibility_en, eligibility_ml, procedure_en, procedure_ml,
  official_portal_name, official_portal_url, govt_fee, nexa_service_charge,
  processing_time_en, processing_time_ml, last_verified_date
) VALUES (
  'digital-signature-certificate', 'identity', 'Identity & Document Services', 'തിരിച്ചറിയൽ രേഖാ സേവനങ്ങൾ', 13,
  'Digital Signature Certificate (DSC)', 'ഡിജിറ്റൽ സിഗ്നേച്ചർ സർട്ടിഫിക്കറ്റ് (DSC)', 'Class 3 Digital Signature Certificate issuance on secure FIPS cryptographic USB token for GST, MCA, and e-Tendering.', 'ജി.എസ്.ടി, എം.സി.എ, ഇ-ടെൻഡർ ആവശ്യങ്ങൾക്കുള്ള ക്ലാസ് 3 ഡിജിറ്റൽ സിഗ്നേച്ചർ ടോക്കൺ.', '[{"id":"class3-individual","name_en":"Class 3 Individual DSC (Signing only or Signing + Encryption)","name_ml":"വ്യക്തിഗത ക്ലാസ് 3 ഡി.എസ്.സി"},{"id":"class3-org","name_en":"Class 3 Organization DSC (Company / LLP / Firm)","name_ml":"സ്ഥാപനങ്ങൾക്കുള്ള ക്ലാസ് 3 ഡി.എസ്.സി"},{"id":"dgft","name_en":"DGFT DSC (for Import / Export Code Filings)","name_ml":"വിദേശ വ്യാപാരത്തിനായുള്ള DGFT ഡി.എസ്.സി"},{"id":"token","name_en":"FIPS Compliant USB Token (ePass2003 / ProxKey)","name_ml":"യു.എസ്.ബി ടോക്കൺ ലഭ്യമാക്കൽ"}]'::jsonb,
  'Individuals, directors, authorized signatories, contractors participating in e-tenders.', 'ടെൻഡറുകളിൽ പങ്കെടുക്കുന്നവർ, കമ്പനി ഡയറക്ടർമാർ, ബിസിനസ്സുകാർ.', '1. Document verification & application filing on Certifying Authority portal
2. Mobile OTP & quick 30-second Video Verification by applicant
3. DSC approved and downloaded onto cryptographic USB token.', '1. രേഖകൾ സമർപ്പിച്ച് അപേക്ഷ നൽകുന്നു
2. മൊബൈൽ ഒ.ടി.പിയും 30 സെക്കൻഡ് വീഡിയോ വെരിഫിക്കേഷനും പൂർത്തിയാക്കുന്നു
3. യു.എസ്.ബി ടോക്കണിൽ ഡി.എസ്.സി ഇൻസ്റ്റാൾ ചെയ്തു നൽകുന്നു.',
  'Authorized Certifying Authority (CCA India)', 'https://cca.gov.in', 1000, 200,
  '1 to 2 working days (after video verification)', '1 മുതൽ 2 പ്രവൃത്തിദിനങ്ങൾ', '2026-11-01'
);
INSERT INTO service_documents (service_key, name_en, name_ml, is_mandatory) VALUES ('digital-signature-certificate', 'Applicant PAN Card copy', 'അപേക്ഷകന്റെ പാൻ കാർഡ്', true);
INSERT INTO service_documents (service_key, name_en, name_ml, is_mandatory) VALUES ('digital-signature-certificate', 'Aadhaar Card copy', 'ആധാർ കാർഡ്', true);
INSERT INTO service_documents (service_key, name_en, name_ml, is_mandatory) VALUES ('digital-signature-certificate', 'Applicant Passport size photograph', 'ഫോട്ടോ', true);
INSERT INTO service_documents (service_key, name_en, name_ml, is_mandatory) VALUES ('digital-signature-certificate', 'Active Mobile Number and Email ID for Video Verification', 'വീഡിയോ വെരിഫിക്കേഷനായി മൊബൈൽ, ഇമെയിൽ', true);
INSERT INTO service_documents (service_key, name_en, name_ml, is_mandatory) VALUES ('digital-signature-certificate', 'Board Resolution / Authorization Letter (for Organization DSC)', 'കമ്പനി അധികാരപത്രം (സ്ഥാപനങ്ങൾക്കുള്ളതിന്)', false);

INSERT INTO services (
  service_key, category_id, category_name_en, category_name_ml, number,
  name_en, name_ml, description_en, description_ml, subservices,
  eligibility_en, eligibility_ml, procedure_en, procedure_ml,
  official_portal_name, official_portal_url, govt_fee, nexa_service_charge,
  processing_time_en, processing_time_ml, last_verified_date
) VALUES (
  'company-registration', 'business', 'Business & Registration Services', 'ബിസിനസ്സ് & രജിസ്ട്രേഷൻ സേവനങ്ങൾ', 14,
  'Company Registration', 'കമ്പനി രജിസ്ട്രേഷൻ', 'Ministry of Corporate Affairs (MCA) incorporation services for Private Limited, OPC, LLP and Partnership.', 'പ്രൈവറ്റ് ലിമിറ്റഡ് കമ്പനി, ഒ.പി.സി, എൽ.എൽ.പി, പാർട്ണർഷിപ്പ് രജിസ്ട്രേഷൻ സേവനങ്ങൾ.', '[{"id":"pvt-ltd","name_en":"Private Limited Company Incorporation (SPICe+)","name_ml":"പ്രൈവറ്റ് ലിമിറ്റഡ് കമ്പനി രജിസ്ട്രേഷൻ"},{"id":"opc","name_en":"One Person Company (OPC) Registration","name_ml":"വൺ പേഴ്സൺ കമ്പനി (OPC)"},{"id":"llp","name_en":"Limited Liability Partnership (LLP) Registration","name_ml":"എൽ.എൽ.പി (LLP) രജിസ്ട്രേഷൻ"},{"id":"partnership","name_en":"Partnership Deed Drafting & RoF Registration","name_ml":"പാർട്ണർഷിപ്പ് ഡീഡ് & രജിസ്ട്രേഷൻ"}]'::jsonb,
  'Entrepreneurs and business founders launching commercial corporate entities in India.', 'പുതിയ ബിസിനസ്സ് ആരംഭിക്കുന്ന സംരംഭകർക്ക്.', '1. Name Approval via RUN / SPICe+ Part A
2. Drafting MoA, AoA and statutory declarations
3. Filing incorporation documents with MCA
4. Certificate of Incorporation, PAN & TAN issuance.', '1. കമ്പനി പേരിന്റെ അനുമതി നേടുന്നു
2. എം.ഒ.എ, എ.ഒ.എ തുടങ്ങിയ രേഖകൾ തയ്യാറാക്കുന്നു
3. എം.സി.എ പോർട്ടലിൽ അപേക്ഷ സമർപ്പിക്കുന്നു
4. സർട്ടിഫിക്കറ്റ് ഓഫ് ഇൻകോർപ്പറേഷൻ, പാൻ, ടാൻ ലഭ്യമാക്കുന്നു.',
  'Ministry of Corporate Affairs (MCA)', 'https://mca.gov.in', 1000, 1500,
  '7 to 14 working days', '7 മുതൽ 14 പ്രവൃത്തിദിനങ്ങൾ', '2026-11-01'
);
INSERT INTO service_documents (service_key, name_en, name_ml, is_mandatory) VALUES ('company-registration', 'PAN Card and Aadhaar Card of all proposed Directors / Partners', 'എല്ലാ ഡയറക്ടർമാരുടെയും പാൻ, ആധാർ കാർഡുകൾ', true);
INSERT INTO service_documents (service_key, name_en, name_ml, is_mandatory) VALUES ('company-registration', 'Bank Statement / Electricity Bill (within last 2 months) of directors', 'ഡയറക്ടർമാരുടെ ബാങ്ക് സ്റ്റേറ്റ്മെന്റ് / കറന്റ് ബിൽ', true);
INSERT INTO service_documents (service_key, name_en, name_ml, is_mandatory) VALUES ('company-registration', 'Registered Office Address proof (Electricity Bill + Owner NOC)', 'ഓഫീസ് വിലാസം തെളിയിക്കുന്ന രേഖ (കറന്റ് ബിൽ + NOC)', true);
INSERT INTO service_documents (service_key, name_en, name_ml, is_mandatory) VALUES ('company-registration', 'Digital Signature Certificate (DSC) of directors', 'ഡയറക്ടർമാരുടെ ഡിജിറ്റൽ സിഗ്നേച്ചർ (DSC)', true);

INSERT INTO services (
  service_key, category_id, category_name_en, category_name_ml, number,
  name_en, name_ml, description_en, description_ml, subservices,
  eligibility_en, eligibility_ml, procedure_en, procedure_ml,
  official_portal_name, official_portal_url, govt_fee, nexa_service_charge,
  processing_time_en, processing_time_ml, last_verified_date
) VALUES (
  'gst-services', 'business', 'Business & Registration Services', 'ബിസിനസ്സ് & രജിസ്ട്രേഷൻ സേവനങ്ങൾ', 15,
  'GST Services', 'ജി.എസ്.ടി (GST) സർവീസുകൾ', 'Goods and Services Tax (GST) registration, monthly/quarterly return filings, e-Way bill and amendments.', 'പുതിയ ജി.എസ്.ടി രജിസ്ട്രേഷൻ, റിട്ടേൺ ഫയലിംഗ്, ഇ-വേ ബിൽ, ജി.എസ്.ടി മാറ്റങ്ങൾ.', '[{"id":"new-gst","name_en":"New GST Registration (Regular / Composition Scheme)","name_ml":"പുതിയ ജി.എസ്.ടി രജിസ്ട്രേഷൻ"},{"id":"returns","name_en":"Monthly & Quarterly GST Returns (GSTR-1, GSTR-3B)","name_ml":"ജി.എസ്.ടി റിട്ടേൺ ഫയലിംഗ്"},{"id":"annual-return","name_en":"GST Annual Return Filing (GSTR-9 / 9C)","name_ml":"വാർഷിക റിട്ടേൺ ഫയലിംഗ്"},{"id":"eway-bill","name_en":"E-Way Bill System Account Setup & Generation","name_ml":"ഇ-വേ ബിൽ സേവനങ്ങൾ"},{"id":"cancellation","name_en":"GST Surrender / Cancellation Application","name_ml":"ജി.എസ്.ടി ക്യാൻസലേഷൻ"}]'::jsonb,
  'Businesses, traders, service providers, and contractors exceeding threshold or opting for voluntary GST.', 'വ്യാപാരികൾ, സേവന ദാതാക്കൾ, കരാറുകാർ.', '1. Submission of REG-01 on GST Common Portal
2. Aadhaar biometric / OTP authentication
3. Department verification and clarification response if queried
4. GSTIN certificate generated.', '1. ജി.എസ്.ടി പോർട്ടലിൽ അപേക്ഷ നൽകുന്നു
2. ആധാർ വെരിഫിക്കേഷൻ പൂർത്തിയാക്കുന്നു
3. വകുപ്പ് പരിശോധനയ്ക്കു ശേഷം ജി.എസ്.ടി നമ്പർ (GSTIN) അനുവദിക്കുന്നു.',
  'GST Common Portal (CBIC)', 'https://gst.gov.in', 0, 250,
  '3 to 7 working days (subject to officer queries)', '3 മുതൽ 7 പ്രവൃത്തിദിനങ്ങൾ', '2026-11-01'
);
INSERT INTO service_documents (service_key, name_en, name_ml, is_mandatory) VALUES ('gst-services', 'PAN Card of Business / Proprietor', 'സ്ഥാപനത്തിന്റെ / ഉടമയുടെ പാൻ കാർഡ്', true);
INSERT INTO service_documents (service_key, name_en, name_ml, is_mandatory) VALUES ('gst-services', 'Aadhaar Card of Proprietor / Partners / Directors', 'ഉടമയുടെ ആധാർ കാർഡ്', true);
INSERT INTO service_documents (service_key, name_en, name_ml, is_mandatory) VALUES ('gst-services', 'Proof of Business Place (Rent Agreement / Property Tax receipt + Electricity Bill)', 'സ്ഥാപന വിലാസ രേഖ (വാടകക്കരാർ / കറന്റ് ബിൽ)', true);
INSERT INTO service_documents (service_key, name_en, name_ml, is_mandatory) VALUES ('gst-services', 'Cancelled Cheque / Bank Statement with name & IFSC', 'ബാങ്ക് പാസ്ബുക്ക് / ക്യാൻസൽ ചെയ്ത ചെക്ക്', true);
INSERT INTO service_documents (service_key, name_en, name_ml, is_mandatory) VALUES ('gst-services', 'Passport size photograph of proprietor', 'പാസ്പോർട്ട് സൈസ് ഫോട്ടോ', true);

INSERT INTO services (
  service_key, category_id, category_name_en, category_name_ml, number,
  name_en, name_ml, description_en, description_ml, subservices,
  eligibility_en, eligibility_ml, procedure_en, procedure_ml,
  official_portal_name, official_portal_url, govt_fee, nexa_service_charge,
  processing_time_en, processing_time_ml, last_verified_date
) VALUES (
  'trademark-registration', 'business', 'Business & Registration Services', 'ബിസിനസ്സ് & രജിസ്ട്രേഷൻ സേവനങ്ങൾ', 16,
  'Trademark Registration', 'ട്രേഡ്മാർക്ക് രജിസ്ട്രേഷൻ', 'Intellectual Property India brand name, logo and wordmark trademark search, TM-A filing and tracking.', 'ബ്രാൻഡ് പേര്, ലോഗോ എന്നിവയുടെ ട്രേഡ്മാർക്ക് രജിസ്ട്രേഷനും നിയമപരമായ സുരക്ഷിതത്വവും.', '[{"id":"tm-search","name_en":"Comprehensive Trademark Public Search across Classes","name_ml":"ട്രേഡ്മാർക്ക് സെർച്ച്"},{"id":"tm-filing","name_en":"Form TM-A Online Trademark Application Filing","name_ml":"ട്രേഡ്മാർക്ക് അപേക്ഷ സമർപ്പിക്കൽ"},{"id":"objection","name_en":"Trademark Examination Report & Objection Response","name_ml":"ഒബ്ജക്ഷൻ മറുപടി നൽകൽ"}]'::jsonb,
  'Individuals, proprietary firms, startups, and companies owning proprietary brand names or logos.', 'സ്വന്തം ബ്രാൻഡ് സംരക്ഷിക്കാൻ ആഗ്രഹിക്കുന്ന സംരംഭകർക്ക്.', '1. Brand search in relevant Nice classification
2. Drafting user affidavit & Form TM-A
3. Filing on IP India portal
4. Use ™ immediately; ® after final registration.', '1. ബ്രാൻഡ് പരിശോധന നടത്തുന്നു
2. അപേക്ഷ തയ്യാറാക്കി സമർപ്പിക്കുന്നു
3. ഉടനടി ™ ചിഹ്നം ഉപയോഗിക്കാം; പൂർണ്ണ അംഗീകാരത്തിന് ശേഷം ® ചിഹ്നം ലഭിക്കുന്നു.',
  'Intellectual Property India (Controller General of Patents & Trademarks)', 'https://ipindiaonline.gov.in', 4500, 500,
  'TM Application: 24-48 hrs | Complete Certificate: 6-12 months', 'അപേക്ഷ: 24-48 മണിക്കൂർ | അന്തിമ സർട്ടിഫിക്കറ്റ്: 6-12 മാസങ്ങൾ', '2026-11-01'
);
INSERT INTO service_documents (service_key, name_en, name_ml, is_mandatory) VALUES ('trademark-registration', 'Brand Logo image in high resolution / Wordmark name', 'ലോഗോ ചിത്രം / ബ്രാൻഡ് പേര്', true);
INSERT INTO service_documents (service_key, name_en, name_ml, is_mandatory) VALUES ('trademark-registration', 'Applicant PAN & Aadhaar Card', 'അപേക്ഷകന്റെ പാൻ, ആധാർ', true);
INSERT INTO service_documents (service_key, name_en, name_ml, is_mandatory) VALUES ('trademark-registration', 'MSME Udyam Registration Certificate (for 50% govt fee concession)', 'എം.എസ്.എം.ഇ ഉദ്യം സർട്ടിഫിക്കറ്റ് (ഫീസ് ഇളവിന്)', false);
INSERT INTO service_documents (service_key, name_en, name_ml, is_mandatory) VALUES ('trademark-registration', 'User Affidavit stating date of first commercial use', 'ബ്രാൻഡ് ഉപയോഗിച്ച തീയതി തെളിയിക്കുന്ന സത്യവാങ്മൂലം', true);

INSERT INTO services (
  service_key, category_id, category_name_en, category_name_ml, number,
  name_en, name_ml, description_en, description_ml, subservices,
  eligibility_en, eligibility_ml, procedure_en, procedure_ml,
  official_portal_name, official_portal_url, govt_fee, nexa_service_charge,
  processing_time_en, processing_time_ml, last_verified_date
) VALUES (
  'msme-udyam-registration', 'business', 'Business & Registration Services', 'ബിസിനസ്സ് & രജിസ്ട്രേഷൻ സേവനങ്ങൾ', 17,
  'MSME Udyam Registration', 'എം.എസ്.എം.ഇ ഉദ്യം രജിസ്ട്രേഷൻ', 'Ministry of MSME official Udyam Registration for Micro, Small and Medium Enterprises to access government benefits.', 'ചെറുകിട, ഇടത്തരം സംരംഭങ്ങൾക്കുള്ള കേന്ദ്ര സർക്കാരിന്റെ ഉദ്യം (Udyam) സർട്ടിഫിക്കറ്റ്.', '[{"id":"new-udyam","name_en":"New Udyam Registration Certificate with QR Code","name_ml":"പുതിയ ഉദ്യം രജിസ്ട്രേഷൻ"},{"id":"update-udyam","name_en":"Update Udyam Details (Turnover, Investment, Activities)","name_ml":"ഉദ്യം വിവരങ്ങൾ പുതുക്കൽ"},{"id":"print-udyam","name_en":"Reprint / Download Verified Udyam Certificate","name_ml":"ഉദ്യം സർട്ടിഫിക്കറ്റ് ഡൗൺലോഡ്"}]'::jsonb,
  'All manufacturing and service enterprises falling within Micro, Small or Medium investment thresholds.', 'നിർമ്മാണ അല്ലെങ്കിൽ സേവന മേഖലയിലുള്ള എല്ലാ ചെറുകിട സംരംഭകർക്കും.', '1. Aadhaar verification & PAN validation on Udyam portal
2. NIC business activity classification
3. Instant Udyam Registration number and certificate download.', '1. ഉദ്യം പോർട്ടലിൽ ആധാർ, പാൻ വിവരങ്ങൾ നൽകുന്നു
2. തൊഴിൽ മേഖല തെരഞ്ഞെടുക്കുന്നു
3. ക്യുആർ കോഡുള്ള ഉദ്യം സർട്ടിഫിക്കറ്റ് ലഭ്യമാകുന്നു.',
  'Ministry of MSME Udyam Registration Portal', 'https://udyamregistration.gov.in', 0, 60,
  '1 to 2 working days', '1 മുതൽ 2 പ്രവൃത്തിദിനങ്ങൾ', '2026-11-01'
);
INSERT INTO service_documents (service_key, name_en, name_ml, is_mandatory) VALUES ('msme-udyam-registration', 'Aadhaar Card of Entrepreneur linked to active mobile', 'മൊബൈൽ ലിങ്ക് ചെയ്ത ആധാർ കാർഡ്', true);
INSERT INTO service_documents (service_key, name_en, name_ml, is_mandatory) VALUES ('msme-udyam-registration', 'Business / Enterprise PAN Card', 'സംരംഭത്തിന്റെ പാൻ കാർഡ്', true);
INSERT INTO service_documents (service_key, name_en, name_ml, is_mandatory) VALUES ('msme-udyam-registration', 'Business Bank Account Number and IFSC Code', 'ബാങ്ക് അക്കൗണ്ട് നമ്പർ & IFSC', true);
INSERT INTO service_documents (service_key, name_en, name_ml, is_mandatory) VALUES ('msme-udyam-registration', 'Details of business activity & number of employees', 'തൊഴിൽ വിവരങ്ങളും ജീവനക്കാരുടെ എണ്ണവും', true);

INSERT INTO services (
  service_key, category_id, category_name_en, category_name_ml, number,
  name_en, name_ml, description_en, description_ml, subservices,
  eligibility_en, eligibility_ml, procedure_en, procedure_ml,
  official_portal_name, official_portal_url, govt_fee, nexa_service_charge,
  processing_time_en, processing_time_ml, last_verified_date
) VALUES (
  'kswift-registration', 'business', 'Business & Registration Services', 'ബിസിനസ്സ് & രജിസ്ട്രേഷൻ സേവനങ്ങൾ', 18,
  'KSWIFT Registration', 'കെ-സ്വിഫ്റ്റ് (KSWIFT) രജിസ്ട്രേഷൻ', 'Kerala Single Window Interface for Fast and Transparent Clearances for commencing enterprise operations in Kerala.', 'കേരളത്തിൽ പുതിയ വ്യവസായങ്ങൾ ആരംഭിക്കുന്നതിനുള്ള കെ-സ്വിഫ്റ്റ് ക്ലിയറൻസ് സർട്ടിഫിക്കറ്റ്.', '[{"id":"msme-acknowledgement","name_en":"Kerala MSME Facilitation Act Acknowledgement Certificate","name_ml":"എം.എസ്.എം.ഇ അക്നോളജ്മെന്റ് സർട്ടിഫിക്കറ്റ്"},{"id":"composite-application","name_en":"Composite Application Form (CAF) for Clearances","name_ml":"ഏകജാലക അനുമതി അപേക്ഷ"},{"id":"kswift-renewal","name_en":"Renewal of Clearances & Licenses","name_ml":"അനുമതികൾ പുതുക്കൽ"}]'::jsonb,
  'Entrepreneurs planning to set up commercial or industrial units in Kerala.', 'കേരളത്തിൽ പുതിയ വ്യാപാര, വ്യവസായ സംരംഭങ്ങൾ തുടങ്ങുന്നവർക്ക്.', '1. One-time registration on KSWIFT portal
2. Self-declaration & CAF filing
3. Instant issuance of Acknowledgement Certificate valid for 3 years without prior inspection for eligible sectors.', '1. കെ-സ്വിഫ്റ്റ് പോർട്ടലിൽ രജിസ്റ്റർ ചെയ്യുന്നു
2. നിശ്ചിത ഫോറത്തിൽ വിവരങ്ങൾ നൽകുന്നു
3. 3 വർഷത്തേക്ക് സാധുതയുള്ള അക്നോളജ്മെന്റ് സർട്ടിഫിക്കറ്റ് ലഭ്യമാക്കുന്നു.',
  'Kerala Single Window Interface (KSWIFT)', 'https://kswift.kerala.gov.in', 0, 200,
  'Instant acknowledgement certificate for eligible MSMEs', 'അർഹമായ സംരംഭങ്ങൾക്ക് തത്സമയം സർട്ടിഫിക്കറ്റ് ലഭിക്കുന്നു', '2026-11-01'
);
INSERT INTO service_documents (service_key, name_en, name_ml, is_mandatory) VALUES ('kswift-registration', 'ID Proof & Address Proof of Applicant (Aadhaar / PAN)', 'തിരിച്ചറിയൽ രേഖകൾ (ആധാർ / പാൻ)', true);
INSERT INTO service_documents (service_key, name_en, name_ml, is_mandatory) VALUES ('kswift-registration', 'Land Document / Possession Certificate / Rental Lease', 'സ്ഥലത്തിന്റെ രേഖ / വാടകക്കരാർ', true);
INSERT INTO service_documents (service_key, name_en, name_ml, is_mandatory) VALUES ('kswift-registration', 'Site Plan and Building Sketch', 'കെട്ടിട പ്ലാൻ / സ്കെച്ച്', false);
INSERT INTO service_documents (service_key, name_en, name_ml, is_mandatory) VALUES ('kswift-registration', 'Brief Project Profile & Power Requirement details', 'പ്രൊജക്റ്റ് വിവരങ്ങൾ', true);

INSERT INTO services (
  service_key, category_id, category_name_en, category_name_ml, number,
  name_en, name_ml, description_en, description_ml, subservices,
  eligibility_en, eligibility_ml, procedure_en, procedure_ml,
  official_portal_name, official_portal_url, govt_fee, nexa_service_charge,
  processing_time_en, processing_time_ml, last_verified_date
) VALUES (
  'fssai-food-safety-registration', 'business', 'Business & Registration Services', 'ബിസിനസ്സ് & രജിസ്ട്രേഷൻ സേവനങ്ങൾ', 19,
  'FSSAI Food Safety Registration', 'ഭക്ഷ്യ സുരക്ഷാ രജിസ്ട്രേഷൻ (FSSAI)', 'Food Safety and Standards Authority of India (FoSCoS) registration and state license for food businesses.', 'ഹോട്ടലുകൾ, ബേക്കറികൾ, തട്ടുകടകൾ, കാറ്ററിംഗ് എന്നിവയ്ക്കുള്ള FSSAI ഭക്ഷ്യ സുരക്ഷാ ലൈസൻസ്.', '[{"id":"basic-registration","name_en":"FSSAI Basic Registration (Annual turnover up to ₹12 Lakhs)","name_ml":"ബേസിക് ഫുഡ് രജിസ്ട്രേഷൻ (₹12 ലക്ഷം വരെ)"},{"id":"state-license","name_en":"FSSAI State License (Annual turnover ₹12 Lakhs to ₹20 Crores)","name_ml":"സ്റ്റേറ്റ് ഫുഡ് ലൈസൻസ്"},{"id":"annual-return","name_en":"FSSAI Annual Return Filing & Renewal","name_ml":"ലൈസൻസ് പുതുക്കൽ"}]'::jsonb,
  'All food business operators including small vendors, tea stalls, restaurants, caterers, bakers, and distributors.', 'ഹോട്ടലുകൾ, തട്ടുകടകൾ, ബേക്കറികൾ, കൂൾബാറുകൾ തുടങ്ങിയ എല്ലാ ഭക്ഷ്യ സംരംഭകർക്കും.', '1. Application filing on FoSCoS portal
2. Scrutiny by Food Safety Officer (FSO)
3. Issuance of 14-digit FSSAI Registration Certificate.', '1. FoSCoS പോർട്ടലിൽ അപേക്ഷ നൽകുന്നു
2. ഭക്ഷ്യ സുരക്ഷാ ഓഫീസറുടെ പരിശോധന
3. 14 അക്ക FSSAI രജിസ്ട്രേഷൻ നമ്പർ ലഭ്യമാകുന്നു.',
  'Food Safety Compliance System (FoSCoS)', 'https://foscos.fssai.gov.in', 100, 100,
  '7 to 15 working days', '7 മുതൽ 15 പ്രവൃത്തിദിനങ്ങൾ', '2026-11-01'
);
INSERT INTO service_documents (service_key, name_en, name_ml, is_mandatory) VALUES ('fssai-food-safety-registration', 'Passport size photograph of Food Business Operator (FBO)', 'ഭക്ഷ്യ സംരംഭകന്റെ ഫോട്ടോ', true);
INSERT INTO service_documents (service_key, name_en, name_ml, is_mandatory) VALUES ('fssai-food-safety-registration', 'Government Photo ID (Aadhaar / Voter ID / PAN)', 'തിരിച്ചറിയൽ രേഖ (ആധാർ)', true);
INSERT INTO service_documents (service_key, name_en, name_ml, is_mandatory) VALUES ('fssai-food-safety-registration', 'Proof of Business Premise (Rental Agreement / Property Tax receipt)', 'സ്ഥാപന വിലാസ രേഖ (വാടകക്കരാർ / നികുതി രസീത്)', true);
INSERT INTO service_documents (service_key, name_en, name_ml, is_mandatory) VALUES ('fssai-food-safety-registration', 'List of Food Product Categories manufactured or sold', 'വിൽക്കുന്ന ഭക്ഷ്യ ഉത്പന്നങ്ങളുടെ ലിസ്റ്റ്', true);

INSERT INTO services (
  service_key, category_id, category_name_en, category_name_ml, number,
  name_en, name_ml, description_en, description_ml, subservices,
  eligibility_en, eligibility_ml, procedure_en, procedure_ml,
  official_portal_name, official_portal_url, govt_fee, nexa_service_charge,
  processing_time_en, processing_time_ml, last_verified_date
) VALUES (
  'website-development', 'business', 'Business & Registration Services', 'ബിസിനസ്സ് & രജിസ്ട്രേഷൻ സേവനങ്ങൾ', 20,
  'Website Development', 'വെബ്സൈറ്റ് ഡെവലപ്‌മെന്റ്', 'Custom professional website design, e-commerce, Google Maps listing and digital presence for Kerala businesses.', 'സ്ഥാപനങ്ങൾക്കും കടകൾക്കും പ്രൊഫഷണൽ വെബ്സൈറ്റുകൾ, ഓൺലൈൻ സ്റ്റോറുകൾ, ഗൂഗിൾ മാപ്പ് ലിസ്റ്റിംഗ്.', '[{"id":"business-site","name_en":"Professional Business / Service Showcase Website","name_ml":"ബിസിനസ്സ് വെബ്സൈറ്റ് നിർമ്മാണം"},{"id":"ecommerce-site","name_en":"Online Store / E-Commerce with WhatsApp Ordering","name_ml":"ഓൺലൈൻ ഷോപ്പിംഗ് വെബ്സൈറ്റ്"},{"id":"domain-hosting","name_en":"Domain Name Registration (.in, .com) & Secure Cloud Hosting","name_ml":"ഡൊമെയ്ൻ, ഹോസ്റ്റിംഗ് സേവനങ്ങൾ"},{"id":"gmb-seo","name_en":"Google Business Profile & Local Search Optimization","name_ml":"ഗൂഗിൾ മാപ്പ് ബിസിനസ്സ് പ്രൊഫൈൽ"}]'::jsonb,
  'Retail shops, service centres, professionals, clinics, schools, and enterprises seeking online customers.', 'ബിസിനസ്സ് ഓൺലൈനിലേക്ക് മാറ്റാൻ ആഗ്രഹിക്കുന്ന ഏതൊരു വ്യക്തിക്കും സ്ഥാപനത്തിനും.', '1. Requirement consultation & design mockup
2. Development of mobile-responsive fast loading website
3. Domain and hosting setup
4. Launch and Google search submission.', '1. ആവശ്യങ്ങൾ ചർച്ച ചെയ്ത് ഡിസൈൻ തയ്യാറാക്കുന്നു
2. മൊബൈലിലും കമ്പ്യൂട്ടറിലും പ്രവർത്തിക്കുന്ന വെബ്സൈറ്റ് നിർമ്മിക്കുന്നു
3. ഡൊമെയ്ൻ കണക്റ്റ് ചെയ്യുന്നു
4. ലൈവായി ലഭ്യമാക്കുന്നു.',
  'Nexa Digital Studio', 'https://wa.me/918086380373', 0, 4999,
  '5 to 10 working days', '5 മുതൽ 10 പ്രവൃത്തിദിനങ്ങൾ', '2026-11-01'
);
INSERT INTO service_documents (service_key, name_en, name_ml, is_mandatory) VALUES ('website-development', 'Business name, logo and brand colors', 'സ്ഥാപനത്തിന്റെ പേര്, ലോഗോ', true);
INSERT INTO service_documents (service_key, name_en, name_ml, is_mandatory) VALUES ('website-development', 'List of products or services with pricing/photos', 'സേവനങ്ങളുടെയും ഉത്പന്നങ്ങളുടെയും വിവരങ്ങൾ', true);
INSERT INTO service_documents (service_key, name_en, name_ml, is_mandatory) VALUES ('website-development', 'Contact address, phone number and email ID', 'ഫോൺ നമ്പർ, വിലാസം, ഇമെയിൽ', true);

INSERT INTO services (
  service_key, category_id, category_name_en, category_name_ml, number,
  name_en, name_ml, description_en, description_ml, subservices,
  eligibility_en, eligibility_ml, procedure_en, procedure_ml,
  official_portal_name, official_portal_url, govt_fee, nexa_service_charge,
  processing_time_en, processing_time_ml, last_verified_date
) VALUES (
  'university-services', 'education', 'Education & Career Services', 'വിദ്യാഭ്യാസ & തൊഴിൽ സേവനങ്ങൾ', 21,
  'University Services', 'യൂണിവേഴ്സിറ്റി സർവീസുകൾ', 'Degree Certificate, Migration, Provisional, Official Transcripts and Revaluation for Kerala, MG, Calicut, KTU, and Kannur.', 'കേരള, എം.ജി, കാലിക്കറ്റ്, കെ.ടി.യു, കണ്ണൂർ സർവ്വകലാശാലാ സർട്ടിഫിക്കറ്റുകൾ, മൈഗ്രേഷൻ, റീവാല്യുവേഷൻ.', '[{"id":"degree-cert","name_en":"Original Degree / Diploma Certificate Application","name_ml":"ഡിഗ്രി / ഡിപ്ലോമ സർട്ടിഫിക്കറ്റ്"},{"id":"provisional","name_en":"Provisional Degree Certificate","name_ml":"പ്രൊവിഷണൽ സർട്ടിഫിക്കറ്റ്"},{"id":"migration","name_en":"University Migration Certificate","name_ml":"മൈഗ്രേഷൻ സർട്ടിഫിക്കറ്റ്"},{"id":"transcript","name_en":"Official Academic Transcripts (for WES / Foreign Study)","name_ml":"ഒഫീഷ്യൽ ട്രാൻസ്ക്രിപ്റ്റ് (WES / വിദേശ പഠനത്തിന്)"},{"id":"revaluation","name_en":"Exam Revaluation & Scrutiny Application","name_ml":"റീവാല്യുവേഷൻ / സൂക്ഷ്മപരിശോധന"}]'::jsonb,
  'Students and alumni of universities in Kerala.', 'കേരളത്തിലെ വിവിധ സർവ്വകലാശാലകളിൽ പഠിച്ച വിദ്യാർത്ഥികൾക്ക്.', '1. Online filing on university student portal
2. Online challan payment
3. University review and verification
4. Certificate dispatched via Speed Post to student address.', '1. യൂണിവേഴ്സിറ്റി പോർട്ടലിൽ അപേക്ഷ നൽകുന്നു
2. സർവ്വകലാശാലാ ഫീസ് അടയ്ക്കുന്നു
3. പരിശോധന പൂർത്തിയാക്കി സ്പീഡ് പോസ്റ്റിൽ സർട്ടിഫിക്കറ്റ് അയക്കുന്നു.',
  'Official University Student Examination Portals', 'https://keralauniversity.ac.in', 450, 50,
  '15 to 30 working days (university schedule dependent)', '15 മുതൽ 30 പ്രവൃത്തിദിനങ്ങൾ', '2026-11-01'
);
INSERT INTO service_documents (service_key, name_en, name_ml, is_mandatory) VALUES ('university-services', 'University Register Number and Hall Ticket copy', 'രജിസ്റ്റർ നമ്പർ, ഹാൾടിക്കറ്റ് കോപ്പി', true);
INSERT INTO service_documents (service_key, name_en, name_ml, is_mandatory) VALUES ('university-services', 'Copies of all semester mark lists / Grade cards', 'എല്ലാ സെമസ്റ്റർ മാർക്ക് ലിസ്റ്റുകളുടെയും പകർപ്പുകൾ', true);
INSERT INTO service_documents (service_key, name_en, name_ml, is_mandatory) VALUES ('university-services', 'Provisional Certificate copy (for Original Degree)', 'പ്രൊവിഷണൽ സർട്ടിഫിക്കറ്റ് കോപ്പി', false);
INSERT INTO service_documents (service_key, name_en, name_ml, is_mandatory) VALUES ('university-services', 'ID Proof (Aadhaar Card)', 'തിരിച്ചറിയൽ രേഖ (ആധാർ)', true);

INSERT INTO services (
  service_key, category_id, category_name_en, category_name_ml, number,
  name_en, name_ml, description_en, description_ml, subservices,
  eligibility_en, eligibility_ml, procedure_en, procedure_ml,
  official_portal_name, official_portal_url, govt_fee, nexa_service_charge,
  processing_time_en, processing_time_ml, last_verified_date
) VALUES (
  'psc-related-services', 'education', 'Education & Career Services', 'വിദ്യാഭ്യാസ & തൊഴിൽ സേവനങ്ങൾ', 22,
  'PSC Related Services', 'പി.എസ്.സി (PSC) സർവീസുകൾ', 'Kerala Public Service Commission Thulasi One Time Registration (OTR), exam confirmations, and profile updates.', 'കേരള പി.എസ്.സി തുളസി വൺ ടൈം രജിസ്ട്രേഷൻ (OTR), അപേക്ഷകൾ, പരീക്ഷാ കൺഫർമേഷൻ, ഹാൾടിക്കറ്റ്.', '[{"id":"otr-new","name_en":"New PSC One Time Registration (OTR)","name_ml":"പുതിയ പി.എസ്.സി OTR രജിസ്ട്രേഷൻ"},{"id":"apply-post","name_en":"Apply for Specific PSC Category Posts & Notifications","name_ml":"പി.എസ്.സി വിജ്ഞാപനങ്ങൾക്ക് അപേക്ഷിക്കൽ"},{"id":"exam-confirmation","name_en":"Submit Exam Confirmation / Select Examination District","name_ml":"പരീക്ഷാ കൺഫർമേഷൻ നൽകൽ"},{"id":"hall-ticket","name_en":"Admission Ticket / Hall Ticket Download","name_ml":"ഹാൾടിക്കറ്റ് ഡൗൺലോഡ്"},{"id":"profile-update","name_en":"Update Qualification, Aadhaar Linking & Profile Correction","name_ml":"വിദ്യാഭ്യാസ യോഗ്യതകൾ പ്രൊഫൈലിൽ ചേർക്കൽ"}]'::jsonb,
  'Candidates seeking Kerala government jobs meeting age and educational qualifications.', 'കേരള സർക്കാർ ജോലി ആഗ്രഹിക്കുന്ന ഉദ്യോഗാർത്ഥികൾക്ക്.', '1. Thulasi profile registration & document upload
2. Aadhaar verification
3. One-click application to eligible category notifications
4. Confirmation submission during candidate window.', '1. തുളസി പോർട്ടലിൽ പ്രൊഫൈൽ ഉണ്ടാക്കുന്നു
2. സർട്ടിഫിക്കറ്റുകൾ അപ്‌ലോഡ് ചെയ്യുന്നു
3. യോഗ്യതയുള്ള തസ്തികകളിലേക്ക് അപേക്ഷിക്കുന്നു
4. പരീക്ഷാ കൺഫർമേഷൻ നൽകുന്നു.',
  'Kerala PSC Thulasi Portal', 'https://thulasi.psc.kerala.gov.in', 0, 40,
  'Instant profile creation / application submission', 'തത്സമയം അപേക്ഷ സമർപ്പിക്കുന്നു', '2026-11-01'
);
INSERT INTO service_documents (service_key, name_en, name_ml, is_mandatory) VALUES ('psc-related-services', 'SSLC Book showing Date of Birth and Registration Number', 'എസ്.എസ്.എൽ.സി ബുക്ക്', true);
INSERT INTO service_documents (service_key, name_en, name_ml, is_mandatory) VALUES ('psc-related-services', 'Plus Two, Degree, PG and Technical Certificates & Marklists', 'പ്ലസ് ടു, ഡിഗ്രി തുടങ്ങിയ സർട്ടിഫിക്കറ്റുകൾ', false);
INSERT INTO service_documents (service_key, name_en, name_ml, is_mandatory) VALUES ('psc-related-services', 'Passport size color photo taken within last 6 months (Name & Date printed at bottom)', 'പേരും തീയതിയും രേഖപ്പെടുത്തിയ ഫോട്ടോ', true);
INSERT INTO service_documents (service_key, name_en, name_ml, is_mandatory) VALUES ('psc-related-services', 'Scanned signature on white paper', 'വെള്ള പേപ്പറിൽ ഒപ്പ്', true);
INSERT INTO service_documents (service_key, name_en, name_ml, is_mandatory) VALUES ('psc-related-services', 'Aadhaar Card', 'ആധാർ കാർഡ്', true);

INSERT INTO services (
  service_key, category_id, category_name_en, category_name_ml, number,
  name_en, name_ml, description_en, description_ml, subservices,
  eligibility_en, eligibility_ml, procedure_en, procedure_ml,
  official_portal_name, official_portal_url, govt_fee, nexa_service_charge,
  processing_time_en, processing_time_ml, last_verified_date
) VALUES (
  'employment-registration', 'education', 'Education & Career Services', 'വിദ്യാഭ്യാസ & തൊഴിൽ സേവനങ്ങൾ', 23,
  'Employment Registration', 'എംപ്ലോയ്മെന്റ് രജിസ്ട്രേഷൻ', 'Department of Employment Kerala online registration, qualification addition, seniority maintenance and renewal.', 'എംപ്ലോയ്മെന്റ് എക്സ്ചേഞ്ച് രജിസ്ട്രേഷൻ, യോഗ്യതകൾ ചേർക്കൽ, സീനിയോറിറ്റി നിലനിർത്തൽ, റിന്യൂവൽ.', '[{"id":"new-reg","name_en":"New Employment Registration","name_ml":"പുതിയ എംപ്ലോയ്മെന്റ് രജിസ്ട്രേഷൻ"},{"id":"add-qualification","name_en":"Add Higher Qualifications (Degree, PG, Diploma, Typing)","name_ml":"ഉന്നത യോഗ്യതകൾ കൂട്ടിച്ചേർക്കൽ"},{"id":"renewal","name_en":"Renewal of Seniority Registration","name_ml":"സീനിയോറിറ്റി പുതുക്കൽ (റിന്യൂവൽ)"},{"id":"transfer","name_en":"Transfer Registration to Another District Exchange","name_ml":"മറ്റൊരു ജില്ലയിലേക്ക് മാറ്റൽ"}]'::jsonb,
  'Job seekers residing in Kerala aged 14 and above.', '14 വയസ്സ് പൂർത്തിയായ കേരളത്തിലെ ഉദ്യോഗാർത്ഥികൾക്ക്.', '1. Online registration on e-Employment portal
2. Document upload & verification
3. Seniority registration card issuance.', '1. പോർട്ടലിൽ വിവരങ്ങൾ രജിസ്റ്റർ ചെയ്യുന്നു
2. രേഖകൾ പരിശോധിക്കുന്നു
3. എംപ്ലോയ്മെന്റ് രജിസ്ട്രേഷൻ കാർഡ് ലഭിക്കുന്നു.',
  'Kerala Employment Exchange Portal', 'https://employment.kerala.gov.in', 0, 30,
  '1 to 3 working days', '1 മുതൽ 3 പ്രവൃത്തിദിനങ്ങൾ', '2026-11-01'
);
INSERT INTO service_documents (service_key, name_en, name_ml, is_mandatory) VALUES ('employment-registration', 'SSLC Certificate copy', 'എസ്.എസ്.എൽ.സി സർട്ടിഫിക്കറ്റ്', true);
INSERT INTO service_documents (service_key, name_en, name_ml, is_mandatory) VALUES ('employment-registration', 'All higher educational certificates and marklists', 'എല്ലാ വിദ്യാഭ്യാസ സർട്ടിഫിക്കറ്റുകളും', false);
INSERT INTO service_documents (service_key, name_en, name_ml, is_mandatory) VALUES ('employment-registration', 'Aadhaar Card copy', 'ആധാർ കാർഡ്', true);
INSERT INTO service_documents (service_key, name_en, name_ml, is_mandatory) VALUES ('employment-registration', 'Caste / Non-Creamy Layer Certificate (for reservation seniority)', 'ജാതി / സംവരണ സർട്ടിഫിക്കറ്റ്', false);

INSERT INTO services (
  service_key, category_id, category_name_en, category_name_ml, number,
  name_en, name_ml, description_en, description_ml, subservices,
  eligibility_en, eligibility_ml, procedure_en, procedure_ml,
  official_portal_name, official_portal_url, govt_fee, nexa_service_charge,
  processing_time_en, processing_time_ml, last_verified_date
) VALUES (
  'educational-related-services', 'education', 'Education & Career Services', 'വിദ്യാഭ്യാസ & തൊഴിൽ സേവനങ്ങൾ', 24,
  'Educational Related Services', 'മറ്റ് വിദ്യാഭ്യാസ സേവനങ്ങൾ', 'Pareeksha Bhavan and Board of Higher Secondary Education duplicate certificates, migration, and equivalence.', 'പരീക്ഷാ ഭവൻ, ഹയർ സെക്കൻഡറി ബോർഡ് ഡ്യൂപ്ലിക്കേറ്റ് സർട്ടിഫിക്കറ്റുകൾ, മൈഗ്രേഷൻ, ഇക്വിവലൻസ് അപേക്ഷകൾ.', '[{"id":"sslc-duplicate","name_en":"SSLC Duplicate Certificate Application (Lost / Damaged)","name_ml":"എസ്.എസ്.എൽ.സി ഡ്യൂപ്ലിക്കേറ്റ് സർട്ടിഫിക്കറ്റ്"},{"id":"hise-migration","name_en":"Plus Two / Higher Secondary Migration Certificate","name_ml":"പ്ലസ് ടു മൈഗ്രേഷൻ സർട്ടിഫിക്കറ്റ്"},{"id":"sslc-correction","name_en":"Name / DOB Correction in School Records","name_ml":"സ്കൂൾ രേഖകളിൽ പേര്, തീയതി തിരുത്തൽ"},{"id":"equivalence","name_en":"Equivalence Certificate Application","name_ml":"ഇക്വിവലൻസ് സർട്ടിഫിക്കറ്റ്"}]'::jsonb,
  'Students educated under Kerala State Board (SSLC / DHSE / VHSE).', 'കേരള സ്റ്റേറ്റ് സിലബസിൽ പഠിച്ച വിദ്യാർത്ഥികൾക്ക്.', '1. Online challan payment on e-Treasury
2. Application filing to Pareeksha Bhavan / Directorate of General Education
3. Verification & certificate issuance.', '1. ഇ-ട്രഷറി വഴി ഫീസ് അടയ്ക്കുന്നു
2. പരീക്ഷാ ഭവനിലേക്ക് അപേക്ഷ നൽകുന്നു
3. വെരിഫിക്കേഷന് ശേഷം സർട്ടിഫിക്കറ്റ് ലഭ്യമാക്കുന്നു.',
  'Kerala Pareeksha Bhavan / DHSE', 'https://pareekshabhavan.kerala.gov.in', 100, 40,
  '10 to 20 working days', '10 മുതൽ 20 പ്രവൃത്തിദിനങ്ങൾ', '2026-11-01'
);
INSERT INTO service_documents (service_key, name_en, name_ml, is_mandatory) VALUES ('educational-related-services', 'Police Missing Certificate & Notary Affidavit (for Duplicate certificate)', 'പോലീസ് റിപ്പോർട്ട് & സത്യവാങ്മൂലം (ഡ്യൂപ്ലിക്കേറ്റിന്)', false);
INSERT INTO service_documents (service_key, name_en, name_ml, is_mandatory) VALUES ('educational-related-services', 'Photocopy of prior marksheet / certificate', 'പഴയ മാർക്ക് ലിസ്റ്റിന്റെ കോപ്പി', true);
INSERT INTO service_documents (service_key, name_en, name_ml, is_mandatory) VALUES ('educational-related-services', 'Aadhaar Card copy', 'ആധാർ കാർഡ്', true);

INSERT INTO services (
  service_key, category_id, category_name_en, category_name_ml, number,
  name_en, name_ml, description_en, description_ml, subservices,
  eligibility_en, eligibility_ml, procedure_en, procedure_ml,
  official_portal_name, official_portal_url, govt_fee, nexa_service_charge,
  processing_time_en, processing_time_ml, last_verified_date
) VALUES (
  'scholarship-services', 'education', 'Education & Career Services', 'വിദ്യാഭ്യാസ & തൊഴിൽ സേവനങ്ങൾ', 25,
  'Scholarship Services', 'സ്കോളർഷിപ്പ് സർവീസുകൾ', 'National Scholarship Portal (NSP), DCE Kerala, and minority scholarship applications and renewals.', 'നാഷണൽ സ്കോളർഷിപ്പ് പോർട്ടൽ (NSP), കോളേജ് വിദ്യാഭ്യാസ വകുപ്പ് (DCE) സ്കോളർഷിപ്പുകൾ.', '[{"id":"nsp-post-matric","name_en":"National Scholarship Portal (NSP) Post Matric Scholarship","name_ml":"നാഷണൽ പോസ്റ്റ് മെട്രിക് സ്കോളർഷിപ്പ്"},{"id":"dce-merit","name_en":"DCE Suvarna Jubilee / State Merit Scholarship","name_ml":"സുവർണ്ണ ജൂബിലി / സ്റ്റേറ്റ് മെറിറ്റ് സ്കോളർഷിപ്പ്"},{"id":"minority-scholarship","name_en":"Post-Matric & MCM Minority Scholarships","name_ml":"ന്യൂനപക്ഷ സ്കോളർഷിപ്പുകൾ"},{"id":"higher-education","name_en":"Kerala Higher Education Council Scholarship","name_ml":"ഉന്നത വിദ്യാഭ്യാസ കൗൺസിൽ സ്കോളർഷിപ്പ്"}]'::jsonb,
  'Meritorious and economically backward students studying in recognized schools, colleges, and polytechnics.', 'സ്കൂളുകളിലും കോളേജുകളിലും പഠിക്കുന്ന അർഹരായ വിദ്യാർത്ഥികൾക്ക്.', '1. One Time Registration (OTR) on NSP / DCE portal
2. Scheme selection & document upload
3. College-level verification
4. Direct Benefit Transfer (DBT) to bank account.', '1. സ്കോളർഷിപ്പ് പോർട്ടലിൽ രജിസ്റ്റർ ചെയ്യുന്നു
2. വിവരങ്ങളും രേഖകളും അപ്‌ലോഡ് ചെയ്യുന്നു
3. കോളേജ് തലത്തിൽ പരിശോധന നടത്തുന്നു
4. തുക നേരിട്ട് ബാങ്ക് അക്കൗണ്ടിലേക്ക് എത്തുന്നു.',
  'National Scholarship Portal & DCE Kerala', 'https://scholarships.gov.in', 0, 50,
  'Annual academic cycle disbursement', 'അധ്യയന വർഷത്തിലെ പരിശോധനയ്ക്ക് ശേഷം തുക ലഭിക്കുന്നു', '2026-11-01'
);
INSERT INTO service_documents (service_key, name_en, name_ml, is_mandatory) VALUES ('scholarship-services', 'Previous qualifying Examination Marklist', 'മുൻ പരീക്ഷയിലെ മാർക്ക് ലിസ്റ്റ്', true);
INSERT INTO service_documents (service_key, name_en, name_ml, is_mandatory) VALUES ('scholarship-services', 'Income Certificate issued by Village Officer', 'വില്ലേജ് ഓഫീസിൽ നിന്നുള്ള വരുമാന സർട്ടിഫിക്കറ്റ്', true);
INSERT INTO service_documents (service_key, name_en, name_ml, is_mandatory) VALUES ('scholarship-services', 'Community / Caste Certificate (if applicable)', 'ജാതി / കമ്മ്യൂണിറ്റി സർട്ടിഫിക്കറ്റ്', false);
INSERT INTO service_documents (service_key, name_en, name_ml, is_mandatory) VALUES ('scholarship-services', 'Bank Passbook with Aadhaar NPCI Seeding', 'ആധാർ ലിങ്ക് ചെയ്ത ബാങ്ക് പാസ്ബുക്ക്', true);
INSERT INTO service_documents (service_key, name_en, name_ml, is_mandatory) VALUES ('scholarship-services', 'College Institution Bonafide Certificate', 'സ്ഥാപനത്തിൽ നിന്നുള്ള ബോണഫൈഡ് സർട്ടിഫിക്കറ്റ്', true);

INSERT INTO services (
  service_key, category_id, category_name_en, category_name_ml, number,
  name_en, name_ml, description_en, description_ml, subservices,
  eligibility_en, eligibility_ml, procedure_en, procedure_ml,
  official_portal_name, official_portal_url, govt_fee, nexa_service_charge,
  processing_time_en, processing_time_ml, last_verified_date
) VALUES (
  'job-related-applications', 'education', 'Education & Career Services', 'വിദ്യാഭ്യാസ & തൊഴിൽ സേവനങ്ങൾ', 26,
  'Job Related Applications', 'തൊഴിൽ അപേക്ഷകൾ (കേന്ദ്ര/സംസ്ഥാന)', 'Online applications for SSC, UPSC, Railway RRB, IBPS Bank Exams, Defense, and State PSU job notifications.', 'എസ്.എസ്.സി, യു.പി.എസ്.സി, റെയിൽവേ ആർ.ആർ.ബി, ബാങ്ക് ഐ.ബി.പി.എസ്, മിലിട്ടറി തുടങ്ങിയ തൊഴിൽ അപേക്ഷകൾ.', '[{"id":"ssc","name_en":"Staff Selection Commission (SSC CGL, CHSL, MTS, GD)","name_ml":"എസ്.എസ്.സി (SSC) പരീക്ഷകൾ"},{"id":"railway-rrb","name_en":"Railway Recruitment Board (RRB NTPC, Group D, ALP)","name_ml":"റെയിൽവേ റിക്രൂട്ട്മെന്റ് (RRB)"},{"id":"ibps-banking","name_en":"IBPS / SBI Bank PO & Clerk Applications","name_ml":"ബാങ്കിംഗ് പരീക്ഷകൾ (SBI / IBPS)"},{"id":"defense-agniveer","name_en":"Indian Army Agniveer, Navy, Airforce & Coast Guard","name_ml":"ഡിഫൻസ് / അഗ്നിവീർ അപേക്ഷകൾ"},{"id":"upsc","name_en":"UPSC Civil Services / NDA / CDS Online Application","name_ml":"യു.പി.എസ്.സി (UPSC) അപേക്ഷകൾ"}]'::jsonb,
  'Eligible citizens meeting specific age, physical, and educational qualification criteria for respective exams.', 'വിജ്ഞാപനത്തിലെ പ്രായ, വിദ്യാഭ്യാസ യോഗ്യതയുള്ള ഉദ്യോഗാർത്ഥികൾക്ക്.', '1. One-Time Registration on respective recruitment board
2. Category & exam center selection
3. Online fee payment
4. Application printout generation.', '1. റിക്രൂട്ട്മെന്റ് ബോർഡിൽ രജിസ്റ്റർ ചെയ്യുന്നു
2. പരീക്ഷാ സെന്റർ തെരഞ്ഞെടുക്കുന്നു
3. ഫീസ് അടച്ച് അപേക്ഷ സമർപ്പിക്കുന്നു
4. പ്രിന്റൗട്ട് നൽകുന്നു.',
  'Staff Selection Commission / RRB / IBPS', 'https://ssc.gov.in', 100, 60,
  'Instant application confirmation with Registration ID', 'തത്സമയം അപേക്ഷ സമർപ്പിച്ച് രജിസ്ട്രേഷൻ സ്ലിപ്പ് ലഭിക്കുന്നു', '2026-11-01'
);
INSERT INTO service_documents (service_key, name_en, name_ml, is_mandatory) VALUES ('job-related-applications', 'Passport photograph matching exact notification specifications', 'വിജ്ഞാപന പ്രകാരമുള്ള പാസ്പോർട്ട് സൈസ് ഫോട്ടോ', true);
INSERT INTO service_documents (service_key, name_en, name_ml, is_mandatory) VALUES ('job-related-applications', 'Clear scanned signature', 'വെള്ള പേപ്പറിൽ ഒപ്പ്', true);
INSERT INTO service_documents (service_key, name_en, name_ml, is_mandatory) VALUES ('job-related-applications', 'Educational Marklists and Certificates', 'വിദ്യാഭ്യാസ സർട്ടിഫിക്കറ്റുകൾ', true);
INSERT INTO service_documents (service_key, name_en, name_ml, is_mandatory) VALUES ('job-related-applications', 'Aadhaar Card / Photo ID proof', 'ആധാർ കാർഡ്', true);
INSERT INTO service_documents (service_key, name_en, name_ml, is_mandatory) VALUES ('job-related-applications', 'Caste / EWS / OBC-NCL Certificate (for fee concession & age relaxation)', 'സംവരണ സർട്ടിഫിക്കറ്റ് (ഫീസ് ഇളവിന്)', false);

INSERT INTO services (
  service_key, category_id, category_name_en, category_name_ml, number,
  name_en, name_ml, description_en, description_ml, subservices,
  eligibility_en, eligibility_ml, procedure_en, procedure_ml,
  official_portal_name, official_portal_url, govt_fee, nexa_service_charge,
  processing_time_en, processing_time_ml, last_verified_date
) VALUES (
  'ug-cap-admission', 'education', 'Education & Career Services', 'വിദ്യാഭ്യാസ & തൊഴിൽ സേവനങ്ങൾ', 27,
  'UG CAP – Undergraduate Centralised Admission', 'യു.ജി ക്യാപ് (UG CAP) ബിരുദ പ്രവേശന രജിസ്ട്രേഷൻ', 'Single-window Centralised Admission Process (CAP) for Degree programmes (BA, BSc, BCom, BBA, BCA) in Kerala universities.', 'കേരള, എം.ജി, കാലിക്കറ്റ്, കണ്ണൂർ സർവ്വകലാശാലകളിലെ ബിരുദ (Degree) കോഴ്സുകൾക്കുള്ള കേന്ദ്രീകൃത അഡ്മിഷൻ പ്രോസസ്.', '[{"id":"calicut-ug-cap","name_en":"Calicut University UG CAP Registration","name_ml":"കാലിക്കറ്റ് സർവ്വകലാശാല UG CAP"},{"id":"mg-ug-cap","name_en":"MG University UG CAP Registration","name_ml":"എം.ജി സർവ്വകലാശാല UG CAP"},{"id":"kerala-ug-cap","name_en":"Kerala University UG CAP Registration","name_ml":"കേരള സർവ്വകലാശാല UG CAP"},{"id":"kannur-ug-cap","name_en":"Kannur University UG CAP Registration","name_ml":"കണ്ണൂർ സർവ്വകലാശാല UG CAP"},{"id":"options-editing","name_en":"College Option Filling, Rearrangement & Allotment Tracking","name_ml":"കോളേജ് ഓപ്ഷനുകൾ നൽകലും മാറ്റലും"}]'::jsonb,
  'Students who have passed Higher Secondary (Plus Two) or equivalent examinations.', 'പ്ലസ് ടു വിജയിച്ച വിദ്യാർത്ഥികൾക്ക്.', '1. Candidate online registration on University CAP portal
2. Entry of Plus Two subject marks and bonus weightages
3. Selection and priority ordering of colleges & degree courses
4. Registration fee payment
5. Trial allotment, first allotment and seat confirmation tracking.', '1. യൂണിവേഴ്സിറ്റി CAP പോർട്ടലിൽ രജിസ്റ്റർ ചെയ്യുന്നു
2. പ്ലസ് ടു മാർക്കുകൾ രേഖപ്പെടുത്തുന്നു
3. കോളേജുകളും കോഴ്സുകളും മുൻഗണനാ ക്രമത്തിൽ തെരഞ്ഞെടുക്കുന്നു
4. ഫീസ് അടയ്ക്കുന്നു
5. അലോട്ട്മെന്റ് പരിശോധിക്കുന്നു.',
  'Kerala University CAP Portals', 'https://admission.uoc.ac.in', 300, 80,
  'Scheduled University allotment rounds (June - August)', 'യൂണിവേഴ്സിറ്റി അലോട്ട്മെന്റ് കലണ്ടർ പ്രകാരം', '2026-11-01'
);
INSERT INTO service_documents (service_key, name_en, name_ml, is_mandatory) VALUES ('ug-cap-admission', 'Plus Two / 12th Standard Register Number and Marksheet', 'പ്ലസ് ടു മാർക്ക് ലിസ്റ്റ് & രജിസ്റ്റർ നമ്പർ', true);
INSERT INTO service_documents (service_key, name_en, name_ml, is_mandatory) VALUES ('ug-cap-admission', 'SSLC Certificate showing Date of Birth', 'എസ്.എസ്.എൽ.സി സർട്ടിഫിക്കറ്റ്', true);
INSERT INTO service_documents (service_key, name_en, name_ml, is_mandatory) VALUES ('ug-cap-admission', 'Aadhaar Card', 'ആധാർ കാർഡ്', true);
INSERT INTO service_documents (service_key, name_en, name_ml, is_mandatory) VALUES ('ug-cap-admission', 'Caste / Non-Creamy Layer / EWS Certificate (for reservation)', 'സംവരണ സർട്ടിഫിക്കറ്റ് (ആവശ്യമെങ്കിൽ)', false);
INSERT INTO service_documents (service_key, name_en, name_ml, is_mandatory) VALUES ('ug-cap-admission', 'NSS / NCC / Sports / Cultural Grace Mark Certificates', 'എൻ.സി.സി / എൻ.എസ്.എസ് ഗ്രേസ് മാർക്ക് സർട്ടിഫിക്കറ്റുകൾ', false);
INSERT INTO service_documents (service_key, name_en, name_ml, is_mandatory) VALUES ('ug-cap-admission', 'Passport size color photograph', 'പാസ്പോർട്ട് സൈസ് ഫോട്ടോ', true);

INSERT INTO services (
  service_key, category_id, category_name_en, category_name_ml, number,
  name_en, name_ml, description_en, description_ml, subservices,
  eligibility_en, eligibility_ml, procedure_en, procedure_ml,
  official_portal_name, official_portal_url, govt_fee, nexa_service_charge,
  processing_time_en, processing_time_ml, last_verified_date
) VALUES (
  'pg-cap-admission', 'education', 'Education & Career Services', 'വിദ്യാഭ്യാസ & തൊഴിൽ സേവനങ്ങൾ', 28,
  'PG CAP – Postgraduate Centralised Admission', 'പി.ജി ക്യാപ് (PG CAP) ബിരുദാനന്തര പ്രവേശന രജിസ്ട്രേഷൻ', 'Centralised Single-Window Admission Process for Post-Graduate Degree programmes (MA, MSc, MCom, MSW, MCJ) across Kerala universities.', 'കേരളത്തിലെ സർവ്വകലാശാലകളിലെ പി.ജി (MA, MSc, MCom, MSW) കോഴ്സുകൾക്കുള്ള ഏകജാലക പ്രവേശന അപേക്ഷകൾ.', '[{"id":"calicut-pg-cap","name_en":"Calicut University PG CAP Registration","name_ml":"കാലിക്കറ്റ് സർവ്വകലാശാല PG CAP"},{"id":"mg-pg-cap","name_en":"MG University PG CAP Registration","name_ml":"എം.ജി സർവ്വകലാശാല PG CAP"},{"id":"kerala-pg-cap","name_en":"Kerala University PG CAP Registration","name_ml":"കേരള സർവ്വകലാശാല PG CAP"},{"id":"kannur-pg-cap","name_en":"Kannur University PG CAP Registration","name_ml":"കണ്ണൂർ സർവ്വകലാശാല PG CAP"},{"id":"options-management","name_en":"Course Options Submission & Allotment Fee Payment","name_ml":"കോഴ്സ് ഓപ്ഷനുകൾ തെരഞ്ഞെടുക്കലും ഫീസ് അടയ്ക്കലും"}]'::jsonb,
  'Graduates who have completed recognized undergraduate degree with prescribed minimum percentage.', 'ബിരുദം പൂർത്തിയാക്കിയ വിദ്യാർത്ഥികൾക്ക്.', '1. Registration on University PG portal
2. Entry of UG Core and Complementary marks
3. Course and college preference selection
4. CAP fee payment & tracking seat allotments.', '1. യൂണിവേഴ്സിറ്റി പി.ജി പോർട്ടലിൽ വിവരങ്ങൾ നൽകുന്നു
2. ഡിഗ്രി മാർക്കുകൾ കൃത്യമായി രേഖപ്പെടുത്തുന്നു
3. കോളേജുകളും കോഴ്സുകളും തെരഞ്ഞെടുക്കുന്നു
4. അലോട്ട്മെന്റ് പരിശോധിക്കുന്നു.',
  'University PG Centralised Allotment Portals', 'https://cap.mgu.ac.in', 400, 100,
  'Scheduled University allotment rounds (July - September)', 'യൂണിവേഴ്സിറ്റി അലോട്ട്മെന്റ് കലണ്ടർ പ്രകാരം', '2026-11-01'
);
INSERT INTO service_documents (service_key, name_en, name_ml, is_mandatory) VALUES ('pg-cap-admission', 'Undergraduate Degree Consolidated Marklist / Grade Cards', 'ഡിഗ്രി കൺസോളിഡേറ്റഡ് മാർക്ക് ലിസ്റ്റ്', true);
INSERT INTO service_documents (service_key, name_en, name_ml, is_mandatory) VALUES ('pg-cap-admission', 'Provisional / Degree Certificate', 'ഡിഗ്രി / പ്രൊവിഷണൽ സർട്ടിഫിക്കറ്റ്', true);
INSERT INTO service_documents (service_key, name_en, name_ml, is_mandatory) VALUES ('pg-cap-admission', 'SSLC Book for Date of Birth verification', 'എസ്.എസ്.എൽ.സി ബുക്ക്', true);
INSERT INTO service_documents (service_key, name_en, name_ml, is_mandatory) VALUES ('pg-cap-admission', 'Aadhaar Card', 'ആധാർ കാർഡ്', true);
INSERT INTO service_documents (service_key, name_en, name_ml, is_mandatory) VALUES ('pg-cap-admission', 'Caste / Community / Non-Creamy Layer / Income Certificate', 'സംവരണ / വരുമാന സർട്ടിഫിക്കറ്റ്', false);

INSERT INTO services (
  service_key, category_id, category_name_en, category_name_ml, number,
  name_en, name_ml, description_en, description_ml, subservices,
  eligibility_en, eligibility_ml, procedure_en, procedure_ml,
  official_portal_name, official_portal_url, govt_fee, nexa_service_charge,
  processing_time_en, processing_time_ml, last_verified_date
) VALUES (
  'rto-mvd-services', 'vehicle', 'Vehicle & Transport Services', 'വാഹന & ഗതാഗത സേവനങ്ങൾ', 29,
  'RTO / MVD Services', 'ആർ.ടി.ഒ / എം.വി.ഡി (MVD) ഡ്രൈവിംഗ് സർവീസുകൾ', 'Ministry of Road Transport Parivahan Sarathi portal services: Learner''s Licence, Driving Licence renewal, and Slot Booking.', 'സാരഥി (Sarathi) പോർട്ടൽ വഴിയുള്ള ലേണേഴ്സ് ലൈസൻസ്, ഡ്രൈവിംഗ് ലൈസൻസ് പുതുക്കൽ, ഡ്യൂപ്ലിക്കേറ്റ് ലൈസൻസ്.', '[{"id":"learners-licence","name_en":"New Learner''s Licence (LL) Application & Online Test Slot","name_ml":"പുതിയ ലേണേഴ്സ് ലൈസൻസ് (LL)"},{"id":"dl-slot","name_en":"Driving Licence Test Slot Booking / Driving Test Schedule","name_ml":"ഡ്രൈവിംഗ് ടെസ്റ്റ് സ്ലോട്ട് ബുക്കിംഗ്"},{"id":"dl-renewal","name_en":"Driving Licence Renewal (Expired / Aging Driver)","name_ml":"ഡ്രൈവിംഗ് ലൈസൻസ് പുതുക്കൽ"},{"id":"duplicate-dl","name_en":"Duplicate Driving Licence (Lost / Damaged)","name_ml":"ഡ്യൂപ്ലിക്കേറ്റ് ഡ്രൈവിംഗ് ലൈസൻസ്"},{"id":"address-change-dl","name_en":"Change of Address in Driving Licence","name_ml":"ലൈസൻസിലെ വിലാസം മാറ്റൽ"},{"id":"idp","name_en":"International Driving Permit (IDP) Assistance","name_ml":"ഇന്റർനാഷണൽ ഡ്രൈവിംഗ് പെർമിറ്റ്"}]'::jsonb,
  'Citizens aged 18+ (or 16+ for gearless 50cc two-wheelers) seeking motor vehicle driving authorization.', '18 വയസ്സ് തികഞ്ഞ ഇന്ത്യൻ പൗരന്മാർക്ക്.', '1. Application filing on Sarathi Parivahan portal
2. Government fee payment & slot reservation
3. Online / In-person learner exam
4. Driving test at Sub-RTO ground
5. Smart Card DL delivered to home.', '1. സാരഥി പോർട്ടലിൽ അപേക്ഷ സമർപ്പിക്കുന്നു
2. ഫീസ് അടച്ച് സ്ലോട്ട് ബുക്ക് ചെയ്യുന്നു
3. ലേണേഴ്സ് പരീക്ഷ പൂർത്തിയാക്കുന്നു
4. ആർ.ടി.ഒ ടെസ്റ്റിന് ഹാജരാകുന്നു
5. ലൈസൻസ് വീട്ടിൽ തപാലിൽ എത്തുന്നു.',
  'Sarathi Parivahan (MoRTH)', 'https://sarathi.parivahan.gov.in', 450, 70,
  '7 to 15 working days post-test', 'ടെസ്റ്റിനു ശേഷം 7 മുതൽ 15 ദിവസങ്ങൾ', '2026-11-01'
);
INSERT INTO service_documents (service_key, name_en, name_ml, is_mandatory) VALUES ('rto-mvd-services', 'Aadhaar Card copy', 'ആധാർ കാർഡ് കോപ്പി', true);
INSERT INTO service_documents (service_key, name_en, name_ml, is_mandatory) VALUES ('rto-mvd-services', 'Age Proof (SSLC Book / Birth Certificate)', 'പ്രായം തെളിയിക്കുന്ന രേഖ (എസ്.എസ്.എൽ.സി)', true);
INSERT INTO service_documents (service_key, name_en, name_ml, is_mandatory) VALUES ('rto-mvd-services', 'Medical Fitness Certificate Form 1A signed by Registered Medical Practitioner (for renewals / age 40+)', 'മെഡിക്കൽ ഫിറ്റ്നസ് സർട്ടിഫിക്കറ്റ് (ഫോം 1A)', false);
INSERT INTO service_documents (service_key, name_en, name_ml, is_mandatory) VALUES ('rto-mvd-services', 'Original Existing Driving Licence (for renewal or address change)', 'നിലവിലെ ഡ്രൈവിംഗ് ലൈസൻസ്', false);
INSERT INTO service_documents (service_key, name_en, name_ml, is_mandatory) VALUES ('rto-mvd-services', 'Passport size color photograph', 'പാസ്പോർട്ട് സൈസ് ഫോട്ടോ', true);

INSERT INTO services (
  service_key, category_id, category_name_en, category_name_ml, number,
  name_en, name_ml, description_en, description_ml, subservices,
  eligibility_en, eligibility_ml, procedure_en, procedure_ml,
  official_portal_name, official_portal_url, govt_fee, nexa_service_charge,
  processing_time_en, processing_time_ml, last_verified_date
) VALUES (
  'vehicle-related-services', 'vehicle', 'Vehicle & Transport Services', 'വാഹന & ഗതാഗത സേവനങ്ങൾ', 30,
  'Vehicle Related Services (Vahan)', 'വാഹന ആർ.സി സർവീസുകൾ (വാഹൻ)', 'Parivahan Vahan citizen services: RC Ownership Transfer, Hypothecation HP cancellation, Road Tax, and Duplicate RC.', 'വാഹൻ പോർട്ടൽ വഴിയുള്ള ആർ.സി ഉടമസ്ഥാവകാശ മാറ്റം, ലോൺ ബാധ്യത ഒഴിവാക്കൽ (HPT), റോഡ് ടാക്സ്, ഫിറ്റ്നസ് സർട്ടിഫിക്കറ്റ്.', '[{"id":"rc-transfer","name_en":"Vehicle Ownership Transfer (Sale / Death / Succession - Form 29 & 30)","name_ml":"ആർ.സി ഉടമസ്ഥാവകാശ മാറ്റം (RC Transfer)"},{"id":"hypothecation-termination","name_en":"Hypothecation Termination (Loan HP NOC Cancellation - Form 35)","name_ml":"ലോൺ ബാധ്യത ഒഴിവാക്കൽ (HPT)"},{"id":"road-tax","name_en":"Kerala Motor Vehicle Road Tax Online Payment","name_ml":"വാഹന റോഡ് ടാക്സ് അടയ്ക്കൽ"},{"id":"duplicate-rc","name_en":"Duplicate RC Book (Lost or Damaged Registration Certificate)","name_ml":"ഡ്യൂപ്ലിക്കേറ്റ് ആർ.സി ബുക്ക്"},{"id":"fitness-slot","name_en":"Vehicle Fitness Certificate (CF) Inspection Slot Booking","name_ml":"ഫിറ്റ്നസ് (CF) ഇൻസ്പെക്ഷൻ സ്ലോട്ട്"},{"id":"noc-transfer","name_en":"Vehicle No Objection Certificate (NOC) for Inter-State Transfer","name_ml":"അന്യസംസ്ഥാനങ്ങളിലേക്ക് മാറ്റാനുള്ള NOC"}]'::jsonb,
  'Vehicle owners and buyers registered with Kerala Motor Vehicles Department.', 'കേരളത്തിൽ രജിസ്റ്റർ ചെയ്ത വാഹനങ്ങളുടെ ഉടമകൾക്കും വാങ്ങുന്നവർക്കും.', '1. Vahan portal online application entry
2. Aadhaar e-Sign authentication of buyer & seller
3. Govt fee payment
4. Physical document submission to Sub-RTO
5. Updated RC dispatched via Speed Post.', '1. വാഹൻ പോർട്ടലിൽ അപേക്ഷ നൽകുന്നു
2. ആധാർ ഒ.ടി.പി വെരിഫിക്കേഷൻ പൂർത്തിയാക്കുന്നു
3. സർക്കാർ ഫീസ് അടയ്ക്കുന്നു
4. ആർ.ടി.ഒ ഓഫീസിൽ ഫയൽ നൽകുന്നു
5. പുതിയ ആർ.സി തപാലിൽ ലഭിക്കുന്നു.',
  'Vahan Parivahan Portal (MoRTH)', 'https://vahan.parivahan.gov.in', 550, 80,
  '7 to 15 working days', '7 മുതൽ 15 പ്രവൃത്തിദിനങ്ങൾ', '2026-11-01'
);
INSERT INTO service_documents (service_key, name_en, name_ml, is_mandatory) VALUES ('vehicle-related-services', 'Original Registration Certificate (RC Book)', 'യഥാർത്ഥ ആർ.സി ബുക്ക്', true);
INSERT INTO service_documents (service_key, name_en, name_ml, is_mandatory) VALUES ('vehicle-related-services', 'Valid Vehicle Insurance Certificate', 'സാധുവായ ഇൻഷുറൻസ് പോളിസി', true);
INSERT INTO service_documents (service_key, name_en, name_ml, is_mandatory) VALUES ('vehicle-related-services', 'Valid Pollution Under Control (PUC) Certificate', 'പുക പരിശോധനാ സർട്ടിഫിക്കറ്റ് (PUC)', true);
INSERT INTO service_documents (service_key, name_en, name_ml, is_mandatory) VALUES ('vehicle-related-services', 'Aadhaar Card of Buyer and Seller', 'വാങ്ങുന്നയാളുടെയും വിൽക്കുന്നയാളുടെയും ആധാർ', true);
INSERT INTO service_documents (service_key, name_en, name_ml, is_mandatory) VALUES ('vehicle-related-services', 'Bank Form 35 & Loan Closure NOC (for HP cancellation)', 'ബാങ്ക് എൻ.ഒ.സി & ഫോം 35 (ലോൺ ഒഴിവാക്കാൻ)', false);

INSERT INTO services (
  service_key, category_id, category_name_en, category_name_ml, number,
  name_en, name_ml, description_en, description_ml, subservices,
  eligibility_en, eligibility_ml, procedure_en, procedure_ml,
  official_portal_name, official_portal_url, govt_fee, nexa_service_charge,
  processing_time_en, processing_time_ml, last_verified_date
) VALUES (
  'insurance-services', 'financial', 'Financial & Payment Services', 'സാമ്പത്തിക & പേയ്മെന്റ് സേവനങ്ങൾ', 31,
  'Insurance Services', 'ഇൻഷുറൻസ് സർവീസുകൾ', 'Instant online policy renewal and issuance for two-wheelers, cars, commercial vehicles, and health insurance.', 'ബൈക്ക്, കാർ, വാണിജ്യ വാഹന ഇൻഷുറൻസ് പോളിസികൾ, ആരോഗ്യ ഇൻഷുറൻസ് പ്രീമിയം അടയ്ക്കൽ.', '[{"id":"two-wheeler","name_en":"Two-Wheeler (Bike / Scooter) Comprehensive & Third-Party Insurance","name_ml":"ബൈക്ക് / സ്കൂട്ടർ ഇൻഷുറൻസ്"},{"id":"car-insurance","name_en":"Private Car Insurance with Zero-Depreciation Add-on","name_ml":"കാർ ഇൻഷുറൻസ്"},{"id":"commercial-vehicle","name_en":"Commercial Vehicle (Goods / Auto / Taxi) Insurance","name_ml":"വാണിജ്യ വാഹന ഇൻഷുറൻസ്"},{"id":"health-insurance","name_en":"Health Insurance & Mediclaim Policy Guidance","name_ml":"ആരോഗ്യ ഇൻഷുറൻസ് പോളിസികൾ"}]'::jsonb,
  'Vehicle owners and individuals seeking risk cover and statutory third-party compliance.', 'വാഹന ഉടമകൾക്കും ഇൻഷുറൻസ് പരിരക്ഷ ആവശ്യമുള്ളവർക്കും.', '1. Premium quotes comparison across leading insurance providers
2. Selection of required coverage and add-ons
3. Secure online premium payment
4. Instant digital policy document download.', '1. പ്രീമിയം നിരക്കുകൾ താരതമ്യം ചെയ്യുന്നു
2. അനുയോജ്യമായ പോളിസി തെരഞ്ഞെടുക്കുന്നു
3. പ്രീമിയം തുക അടയ്ക്കുന്നു
4. തൽക്ഷണം ഡിജിറ്റൽ പോളിസി ലഭ്യമാക്കുന്നു.',
  'IRDAI Authorized Insurer Portals', 'https://www.irdai.gov.in', 0, 40,
  'Instant policy delivery in 5 minutes', '5 മിനിറ്റിൽ തത്സമയം പോളിസി ലഭിക്കുന്നു', '2026-11-01'
);
INSERT INTO service_documents (service_key, name_en, name_ml, is_mandatory) VALUES ('insurance-services', 'Vehicle RC Book copy (or Vehicle Registration Number)', 'വാഹനത്തിന്റെ ആർ.സി ബുക്ക് കോപ്പി', true);
INSERT INTO service_documents (service_key, name_en, name_ml, is_mandatory) VALUES ('insurance-services', 'Previous Insurance Policy copy (if available)', 'നിലവിലെ ഇൻഷുറൻസ് കോപ്പി', false);
INSERT INTO service_documents (service_key, name_en, name_ml, is_mandatory) VALUES ('insurance-services', 'Owner Aadhaar Card / PAN Card', 'ഉടമയുടെ ആധാർ / പാൻ കാർഡ്', true);

INSERT INTO services (
  service_key, category_id, category_name_en, category_name_ml, number,
  name_en, name_ml, description_en, description_ml, subservices,
  eligibility_en, eligibility_ml, procedure_en, procedure_ml,
  official_portal_name, official_portal_url, govt_fee, nexa_service_charge,
  processing_time_en, processing_time_ml, last_verified_date
) VALUES (
  'tax-payment-services', 'financial', 'Financial & Payment Services', 'സാമ്പത്തിക & പേയ്മെന്റ് സേവനങ്ങൾ', 32,
  'Tax Payment Services', 'നികുതി പേയ്മെന്റ് സർവീസുകൾ', 'Kerala Land Tax (Thandapper e-Payment), Sanchaya Municipal Property Tax, and Professional Tax e-filing.', 'ഭൂനികുതി (പോക്കുവരവ് / തണ്ടപ്പേര്), പഞ്ചായത്ത് / മുനിസിപ്പൽ കെട്ടിട നികുതി, പ്രൊഫഷണൽ ടാക്സ് അടയ്ക്കൽ.', '[{"id":"land-tax","name_en":"Kerala Revenue Land Tax (ഭൂനികുതി / Thandapper e-Payment)","name_ml":"ഭൂനികുതി അടയ്ക്കൽ (ഇ-റവന്യൂ)"},{"id":"building-tax","name_en":"Sanchaya Building & Property Tax","name_ml":"കെട്ടിട നികുതി അടയ്ക്കൽ (സഞ്ചയ)"},{"id":"professional-tax","name_en":"LSGD Professional Tax e-Payment","name_ml":"തൊഴിൽ നികുതി (പ്രൊഫഷണൽ ടാക്സ്)"},{"id":"income-tax-challan","name_en":"Challan 280 Self-Assessment / Advance Income Tax Payment","name_ml":"ഇൻകം ടാക്സ് ചെല്ലാൻ അടയ്ക്കൽ"}]'::jsonb,
  'Landowners, homeowners, professionals, and taxpayers in Kerala.', 'കേരളത്തിലെ ഭൂവുടമകൾ, കെട്ടിട ഉടമകൾ, നികുതിദായകർ.', '1. Search records via Thandapper or Assessment ID
2. Verification of current dues & arrears
3. Secure payment via e-Treasury / payment gateway
4. Verified digital tax receipt generation.', '1. തണ്ടപ്പേര് നമ്പർ ഉപയോഗിച്ച് നികുതി പരിശോധിക്കുന്നു
2. സർക്കാർ ഗേറ്റ്‌വേ വഴി തുക അടയ്ക്കുന്നു
3. ഔദ്യോഗിക ക്യുആർ കോഡ് രസീത് നൽകുന്നു.',
  'Kerala Revenue & Sanchaya Tax Portals', 'https://revenue.kerala.gov.in', 0, 30,
  'Instant digitally signed e-Receipt', 'തത്സമയം ഔദ്യോഗിക നികുതി രസീത് ലഭിക്കുന്നു', '2026-11-01'
);
INSERT INTO service_documents (service_key, name_en, name_ml, is_mandatory) VALUES ('tax-payment-services', 'Previous Land Tax Receipt showing Thandapper / Survey number', 'പഴയ ഭൂനികുതി രസീത് / തണ്ടപ്പേര് നമ്പർ', true);
INSERT INTO service_documents (service_key, name_en, name_ml, is_mandatory) VALUES ('tax-payment-services', 'Building Tax Assessment Number / Previous Sanchaya receipt', 'കെട്ടിട നികുതി അസസ്സ്മെന്റ് നമ്പർ', false);
INSERT INTO service_documents (service_key, name_en, name_ml, is_mandatory) VALUES ('tax-payment-services', 'Village and Local Body Name', 'വില്ലേജ്, തദ്ദേശ സ്ഥാപന പേര്', true);

INSERT INTO services (
  service_key, category_id, category_name_en, category_name_ml, number,
  name_en, name_ml, description_en, description_ml, subservices,
  eligibility_en, eligibility_ml, procedure_en, procedure_ml,
  official_portal_name, official_portal_url, govt_fee, nexa_service_charge,
  processing_time_en, processing_time_ml, last_verified_date
) VALUES (
  'loan-emi-payments', 'financial', 'Financial & Payment Services', 'സാമ്പത്തിക & പേയ്മെന്റ് സേവനങ്ങൾ', 33,
  'Loan EMI Payments', 'വായ്പ ഇ.എം.ഐ (Loan EMI) അടയ്ക്കൽ', 'Online loan installment payments for Banks, NBFCs, Microfinance, Gold Loans, and Vehicle Loans through BBPS.', 'ബാങ്കുകൾ, എൻ.ബി.എഫ്.സി, മൈക്രോഫിനാൻസ്, വാഹന വായ്പ എന്നിവയുടെ പ്രതിമാസ ഇ.എം.ഐ അടയ്ക്കൽ.', '[{"id":"nbfc-emi","name_en":"NBFC Loan EMI (Bajaj, Muthoot, Manappuram, Shriram, Cholamandalam)","name_ml":"എൻ.ബി.എഫ്.സി ലോൺ ഇ.എം.ഐ"},{"id":"vehicle-emi","name_en":"Commercial & Private Vehicle Loan Installments","name_ml":"വാഹന ലോൺ തിരിച്ചടവ്"},{"id":"microfinance-emi","name_en":"Microfinance & Self-Help Group Weekly/Monthly EMI","name_ml":"മൈക്രോഫിനാൻസ് അടവുകൾ"},{"id":"personal-loan-emi","name_en":"Personal Loan & Housing Loan Repayment","name_ml":"ഭവന / വ്യക്തിഗത വായ്പ അടവ്"}]'::jsonb,
  'Borrowers with active loans across registered commercial banks and NBFCs.', 'വായ്പ തിരിച്ചടവുള്ള ഏതൊരു വ്യക്തിക്കും.', '1. Fetch outstanding due details via BBPS integration
2. Verification of borrower name and EMI amount
3. Instant payment processing and BBPS confirmation receipt.', '1. ലോൺ നമ്പർ നൽകി കുടിശ്ശിക പരിശോധിക്കുന്നു
2. തുക പരിശോധിച്ച് ഓൺലൈനായി അടയ്ക്കുന്നു
3. തത്സമയ പെയ്മെന്റ് രസീത് നൽകുന്നു.',
  'Bharat BillPay (BBPS)', 'https://www.bharatbillpay.com', 0, 20,
  'Instant payment with BBPS transaction reference', 'തത്സമയം ഇടപാട് പൂർത്തിയായി രസീത് ലഭിക്കുന്നു', '2026-11-01'
);
INSERT INTO service_documents (service_key, name_en, name_ml, is_mandatory) VALUES ('loan-emi-payments', 'Loan Account Number (LAN)', 'ലോൺ അക്കൗണ്ട് നമ്പർ (LAN)', true);
INSERT INTO service_documents (service_key, name_en, name_ml, is_mandatory) VALUES ('loan-emi-payments', 'Lending Bank / NBFC Institution Name', 'ഫിനാൻസ് സ്ഥാപനത്തിന്റെ പേര്', true);
INSERT INTO service_documents (service_key, name_en, name_ml, is_mandatory) VALUES ('loan-emi-payments', 'Registered Mobile Number of Borrower', 'രജിസ്റ്റർ ചെയ്ത മൊബൈൽ നമ്പർ', true);

INSERT INTO services (
  service_key, category_id, category_name_en, category_name_ml, number,
  name_en, name_ml, description_en, description_ml, subservices,
  eligibility_en, eligibility_ml, procedure_en, procedure_ml,
  official_portal_name, official_portal_url, govt_fee, nexa_service_charge,
  processing_time_en, processing_time_ml, last_verified_date
) VALUES (
  'pension-services', 'financial', 'Financial & Payment Services', 'സാമ്പത്തിക & പേയ്മെന്റ് സേവനങ്ങൾ', 34,
  'Pension Services', 'പെൻഷൻ സർവീസുകൾ', 'Sevana Social Security Welfare Pensions, Jeevan Pramaan Digital Life Certificate, and Central Pension facilitation.', 'ക്ഷേമ പെൻഷൻ അപേക്ഷകൾ (സേവന), ജീവൻ പ്രമാൺ ഡിജിറ്റൽ ലൈഫ് സർട്ടിഫിക്കറ്റ് സമർപ്പിക്കൽ.', '[{"id":"sevana-welfare-pension","name_en":"Social Security Welfare Pension Application (Old Age, Widow, Disability)","name_ml":"സാമൂഹ്യ സുരക്ഷാ ക്ഷേമ പെൻഷൻ അപേക്ഷ"},{"id":"jeevan-pramaan","name_en":"Jeevan Pramaan Digital Life Certificate (Biometric / Face Auth)","name_ml":"ജീവൻ പ്രമാൺ ഡിജിറ്റൽ ലൈഫ് സർട്ടിഫിക്കറ്റ്"},{"id":"pension-mustering","name_en":"Annual Social Security Pension Mustering Assistance","name_ml":"വാർഷിക പെൻഷൻ മസ്റ്ററിംഗ്"},{"id":"pension-status","name_en":"Sevana Pension DBT Payment Status & Arrears Tracking","name_ml":"പെൻഷൻ തുക ലഭിച്ച വിവരങ്ങൾ പരിശോധിക്കൽ"}]'::jsonb,
  'Senior citizens, widows, differently-abled individuals, agricultural workers, and retired government/defense personnel.', 'മുതിർന്ന പൗരന്മാർ, വികലാംഗർ, വിധവകൾ, സർവീസ് പെൻഷൻകാർ.', '1. Aadhaar biometric or face authentication on Jeevan Pramaan portal
2. Digital Life Certificate generation and automatic submission to Pension Sanctioning Authority
3. Instant Pramaan ID acknowledgement generation.', '1. ആധാർ ബയോമെട്രിക് വഴി ജീവൻ പ്രമാൺ രേഖപ്പെടുത്തുന്നു
2. ഡിജിറ്റൽ ലൈഫ് സർട്ടിഫിക്കറ്റ് സമർപ്പിക്കുന്നു
3. പെൻഷൻ അതോറിറ്റിയിലേക്ക് വിവരങ്ങൾ എത്തുന്നു.',
  'Jeevan Pramaan & Sevana Pension Kerala', 'https://jeevanpramaan.gov.in', 0, 30,
  'Instant Pramaan ID generation', 'തത്സമയം മസ്റ്ററിംഗ് പൂർത്തിയാകുന്നു', '2026-11-01'
);
INSERT INTO service_documents (service_key, name_en, name_ml, is_mandatory) VALUES ('pension-services', 'Pensioner Aadhaar Card copy', 'ആധാർ കാർഡ്', true);
INSERT INTO service_documents (service_key, name_en, name_ml, is_mandatory) VALUES ('pension-services', 'Pension Payment Order (PPO) Number or Sevana Pension ID', 'പി.പി.ഒ (PPO) നമ്പർ / പെൻഷൻ ഐഡി', true);
INSERT INTO service_documents (service_key, name_en, name_ml, is_mandatory) VALUES ('pension-services', 'Bank Account Passbook / Post Office Account Passbook', 'ബാങ്ക് പാസ്ബുക്ക്', true);
INSERT INTO service_documents (service_key, name_en, name_ml, is_mandatory) VALUES ('pension-services', 'Ration Card copy', 'റേഷൻ കാർഡ് കോപ്പി', true);
INSERT INTO service_documents (service_key, name_en, name_ml, is_mandatory) VALUES ('pension-services', 'Income & Age proof from Village Officer (for new welfare pensions)', 'വരുമാന, പ്രായ തെളിവ് സർട്ടിഫിക്കറ്റ്', false);

INSERT INTO services (
  service_key, category_id, category_name_en, category_name_ml, number,
  name_en, name_ml, description_en, description_ml, subservices,
  eligibility_en, eligibility_ml, procedure_en, procedure_ml,
  official_portal_name, official_portal_url, govt_fee, nexa_service_charge,
  processing_time_en, processing_time_ml, last_verified_date
) VALUES (
  'utility-bill-payments', 'financial', 'Financial & Payment Services', 'സാമ്പത്തിക & പേയ്മെന്റ് സേവനങ്ങൾ', 35,
  'Utility Bill Payments', 'യൂട്ടിലിറ്റി ബിൽ പേയ്മെന്റുകൾ', 'Authorized Bharat Bill Payment System (BBPS) counter for broadband, landline, piped gas, and postpaid mobile bills.', 'ബ്രോഡ്‌ബാൻഡ്, ലാൻഡ്‌ലൈൻ, ഗ്യാസ്, പോസ്റ്റ്‌പെയ്ഡ് മൊബൈൽ ബില്ലുകൾ തത്സമയം അടയ്ക്കൽ.', '[{"id":"broadband","name_en":"Broadband & Fiber Bills (BSNL, Asianet, Kerala Vision, Airtel, JioFiber)","name_ml":"ബ്രോഡ്‌ബാൻഡ് ബില്ലുകൾ"},{"id":"piped-gas","name_en":"Piped Natural Gas (PNG) / LPG Cylinder Online Booking & Payment","name_ml":"ഗ്യാസ് ബിൽ അടയ്ക്കൽ"},{"id":"landline","name_en":"Landline Telephone Bills (BSNL / Airtel)","name_ml":"ലാൻഡ്‌ലൈൻ ബില്ലുകൾ"},{"id":"postpaid-mobile","name_en":"Postpaid Mobile Bill Payment","name_ml":"പോസ്റ്റ്‌പെയ്ഡ് മൊബൈൽ ബിൽ"}]'::jsonb,
  'All utility consumers.', 'എല്ലാ യൂട്ടിലിറ്റി ഉപഭോക്താക്കൾക്കും.', '1. Fetch real-time bill amount via BBPS
2. Cash / UPI / Card payment at counter
3. Instant authorized BBPS receipt with transaction ID.', '1. ബിൽ തുക പരിശോധിക്കുന്നു
2. പണം അടയ്ക്കുന്നു
3. തൽക്ഷണം രസീത് ലഭിക്കുന്നു.',
  'Bharat BillPay (BBPS)', 'https://www.bharatbillpay.com', 0, 10,
  'Instant online payment', 'തത്സമയം ബിൽ അടയ്ക്കുന്നു', '2026-11-01'
);
INSERT INTO service_documents (service_key, name_en, name_ml, is_mandatory) VALUES ('utility-bill-payments', 'Consumer Number / Telephone Number / Customer Account ID', 'കൺസ്യൂമർ നമ്പർ / ഫോൺ നമ്പർ', true);
INSERT INTO service_documents (service_key, name_en, name_ml, is_mandatory) VALUES ('utility-bill-payments', 'Service Provider Name', 'സർവീസ് പ്രൊവൈഡറുടെ പേര്', true);

INSERT INTO services (
  service_key, category_id, category_name_en, category_name_ml, number,
  name_en, name_ml, description_en, description_ml, subservices,
  eligibility_en, eligibility_ml, procedure_en, procedure_ml,
  official_portal_name, official_portal_url, govt_fee, nexa_service_charge,
  processing_time_en, processing_time_ml, last_verified_date
) VALUES (
  'kseb-related-services', 'financial', 'Financial & Payment Services', 'സാമ്പത്തിക & പേയ്മെന്റ് സേവനങ്ങൾ', 36,
  'KSEB Related Services', 'കെ.എസ്.ഇ.ബി (KSEB) സർവീസുകൾ', 'Kerala State Electricity Board bill payment, new electric connection application, ownership transfer, and load changes.', 'കെ.എസ്.ഇ.ബി കറന്റ് ബിൽ അടയ്ക്കൽ, പുതിയ കണക്ഷൻ അപേക്ഷ, ഉടമസ്ഥാവകാശ മാറ്റം, താരിഫ് മാറ്റം.', '[{"id":"bill-payment","name_en":"KSEB Electricity Bill Payment (Instant e-Receipt)","name_ml":"കറന്റ് ബിൽ അടയ്ക്കൽ"},{"id":"new-connection","name_en":"New Electric Connection Application (Domestic / Commercial LT)","name_ml":"പുതിയ വൈദ്യുതി കണക്ഷൻ അപേക്ഷ"},{"id":"name-transfer","name_en":"Ownership Name Transfer of Electricity Meter","name_ml":"മീറ്റർ ഉടമസ്ഥാവകാശ മാറ്റം"},{"id":"tariff-change","name_en":"Tariff Change & Connected Load Extension Application","name_ml":"താരിഫ് മാറ്റം / ലോഡ് കൂട്ടൽ"}]'::jsonb,
  'All electricity consumers and premises owners under KSEB Limited jurisdiction in Kerala.', 'കേരളത്തിലെ എല്ലാ കെ.എസ്.ഇ.ബി ഉപഭോക്താക്കൾക്കും.', '1. Consumer number validation on KSEB WSS portal
2. Bill payment / application submission
3. Instant payment acknowledgment receipt.', '1. കൺസ്യൂമർ നമ്പർ നൽകുന്നു
2. തുക അടയ്ക്കുന്നു അല്ലെങ്കിൽ അപേക്ഷ സമർപ്പിക്കുന്നു
3. ഒഫീഷ്യൽ രസീത് ലഭ്യമാക്കുന്നു.',
  'KSEB Web Self Service Portal', 'https://wss.kseb.in', 0, 10,
  'Bill Payment: Instant | New Connection: 7-10 working days', 'ബിൽ അടയ്ക്കൽ: തത്സമയം | പുതിയ കണക്ഷൻ: 7-10 ദിവസങ്ങൾ', '2026-11-01'
);
INSERT INTO service_documents (service_key, name_en, name_ml, is_mandatory) VALUES ('kseb-related-services', '13-digit KSEB Consumer Number', '13 അക്ക കൺസ്യൂമർ നമ്പർ', true);
INSERT INTO service_documents (service_key, name_en, name_ml, is_mandatory) VALUES ('kseb-related-services', 'Building Tax Assessment receipt / Ownership proof (for new connection / name change)', 'കെട്ടിട നികുതി രസീത് / ആധാര പകർപ്പ്', false);
INSERT INTO service_documents (service_key, name_en, name_ml, is_mandatory) VALUES ('kseb-related-services', 'Aadhaar Card copy of applicant', 'ആധാർ കാർഡ്', false);
INSERT INTO service_documents (service_key, name_en, name_ml, is_mandatory) VALUES ('kseb-related-services', 'Licensed Electrical Contractor Wiring Completion Test Certificate (for new connection)', 'വയറിംഗ് പൂർത്തിയായ ടെസ്റ്റ് സർട്ടിഫിക്കറ്റ്', false);

INSERT INTO services (
  service_key, category_id, category_name_en, category_name_ml, number,
  name_en, name_ml, description_en, description_ml, subservices,
  eligibility_en, eligibility_ml, procedure_en, procedure_ml,
  official_portal_name, official_portal_url, govt_fee, nexa_service_charge,
  processing_time_en, processing_time_ml, last_verified_date
) VALUES (
  'kerala-water-authority-services', 'financial', 'Financial & Payment Services', 'സാമ്പത്തിക & പേയ്മെന്റ് സേവനങ്ങൾ', 37,
  'Kerala Water Authority Services', 'കേരള വാട്ടർ അതോറിറ്റി സർവീസുകൾ', 'Kerala Water Authority (KWA) water charges online payment, new domestic connection application, and meter complaints.', 'വാട്ടർ അതോറിറ്റി കുടിവെള്ള ബിൽ അടയ്ക്കൽ, പുതിയ കണക്ഷൻ അപേക്ഷ, പേര് മാറ്റം.', '[{"id":"bill-payment","name_en":"KWA Water Bill Payment with Instant e-Receipt","name_ml":"കുടിവെള്ള ബിൽ അടയ്ക്കൽ"},{"id":"new-connection","name_en":"New Domestic Water Supply Connection Application","name_ml":"പുതിയ കുടിവെള്ള കണക്ഷൻ"},{"id":"name-change","name_en":"Ownership Name Change in Water Connection","name_ml":"കണക്ഷനിലെ പേര് മാറ്റൽ"}]'::jsonb,
  'Domestic and commercial water connection holders under Kerala Water Authority.', 'വാട്ടർ അതോറിറ്റിയുടെ കുടിവെള്ള കണക്ഷൻ ഉള്ളവർക്കും ആവശ്യമുള്ളവർക്കും.', '1. Lookup consumer account on e-KWA portal
2. Payment processing
3. Official receipt download.', '1. കൺസ്യൂമർ വിവരങ്ങൾ പരിശോധിക്കുന്നു
2. ബിൽ തുക അടയ്ക്കുന്നു
3. രസീത് നൽകുന്നു.',
  'Kerala Water Authority (e-KWA)', 'https://kwa.kerala.gov.in', 0, 10,
  'Instant bill settlement', 'തത്സമയം ബിൽ അടയ്ക്കുന്നു', '2026-11-01'
);
INSERT INTO service_documents (service_key, name_en, name_ml, is_mandatory) VALUES ('kerala-water-authority-services', 'KWA Consumer ID and Consumer Number', 'കൺസ്യൂമർ ഐഡിയും നമ്പറും', true);
INSERT INTO service_documents (service_key, name_en, name_ml, is_mandatory) VALUES ('kerala-water-authority-services', 'Building Tax Receipt of current year (for new connection)', 'നടപ്പുവർഷത്തെ കെട്ടിട നികുതി രസീത്', false);
INSERT INTO service_documents (service_key, name_en, name_ml, is_mandatory) VALUES ('kerala-water-authority-services', 'Aadhaar Card copy', 'ആധാർ കാർഡ്', false);

INSERT INTO services (
  service_key, category_id, category_name_en, category_name_ml, number,
  name_en, name_ml, description_en, description_ml, subservices,
  eligibility_en, eligibility_ml, procedure_en, procedure_ml,
  official_portal_name, official_portal_url, govt_fee, nexa_service_charge,
  processing_time_en, processing_time_ml, last_verified_date
) VALUES (
  'mobile-recharge', 'financial', 'Financial & Payment Services', 'സാമ്പത്തിക & പേയ്മെന്റ് സേവനങ്ങൾ', 38,
  'Mobile Recharge', 'മൊബൈൽ റീച്ചാർജ്ജ്', 'Prepaid mobile recharges, validity extensions, 5G data booster packs for Jio, Airtel, Vi, and BSNL.', 'ജിയോ, എയർടെൽ, വിഐ, ബി.എസ്.എൻ.എൽ പ്രീപെയ്ഡ് മൊബൈൽ റീച്ചാർജ്ജുകൾ, വാലിഡിറ്റി പ്ലാനുകൾ.', '[{"id":"jio","name_en":"Jio Prepaid Recharge Plans & 5G Unlimited","name_ml":"ജിയോ റീച്ചാർജ്ജ്"},{"id":"airtel","name_en":"Airtel Truly Unlimited Voice & Data Packs","name_ml":"എയർടെൽ റീച്ചാർജ്ജ്"},{"id":"vi","name_en":"Vodafone Idea (Vi) Hero Unlimited Plans","name_ml":"വിഐ (Vi) റീച്ചാർജ്ജ്"},{"id":"bsnl","name_en":"BSNL Long-term Validity & Voice Vouchers","name_ml":"ബി.എസ്.എൻ.എൽ റീച്ചാർജ്ജ്"}]'::jsonb,
  'All prepaid mobile subscribers in India.', 'എല്ലാ പ്രീപെയ്ഡ് മൊബൈൽ ഉപഭോക്താക്കൾക്കും.', '1. Select operator and review available tariff plans
2. Instant recharge execution
3. Operator SMS confirmation to customer phone.', '1. നമ്പർ നൽകി അനുയോജ്യമായ പ്ലാൻ തെരഞ്ഞെടുക്കുന്നു
2. റീച്ചാർജ്ജ് ചെയ്യുന്നു
3. ഫോണിലേക്ക് കൺഫർമേഷൻ മെസ്സേജ് വരുന്നു.',
  'Authorized Telecom Integrators', 'https://wa.me/918086380373', 0, 0,
  'Instant within 10 seconds', 'തത്സമയം റീച്ചാർജ്ജ് ആകുന്നു', '2026-11-01'
);
INSERT INTO service_documents (service_key, name_en, name_ml, is_mandatory) VALUES ('mobile-recharge', '10-digit Mobile Number and Operator Circle', '10 അക്ക മൊബൈൽ നമ്പർ', true);

INSERT INTO services (
  service_key, category_id, category_name_en, category_name_ml, number,
  name_en, name_ml, description_en, description_ml, subservices,
  eligibility_en, eligibility_ml, procedure_en, procedure_ml,
  official_portal_name, official_portal_url, govt_fee, nexa_service_charge,
  processing_time_en, processing_time_ml, last_verified_date
) VALUES (
  'tv-recharge', 'financial', 'Financial & Payment Services', 'സാമ്പത്തിക & പേയ്മെന്റ് സേവനങ്ങൾ', 39,
  'TV Recharge', 'ടി.വി / ഡി.ടി.എച്ച് (DTH) റീച്ചാർജ്ജ്', 'Instant online DTH television recharges for Sun Direct, Tata Play, Airtel Digital TV, Dish TV, and d2h.', 'സൺ ഡയറക്ട്, ടാറ്റാ പ്ലേ, എയർടെൽ ഡിജിറ്റൽ ടിവി, ഡിഷ് ടിവി, കേബിൾ ടിവി റീച്ചാർജ്ജുകൾ.', '[{"id":"sun-direct","name_en":"Sun Direct DTH Malayalam Packs","name_ml":"സൺ ഡയറക്ട് റീച്ചാർജ്ജ്"},{"id":"tata-play","name_en":"Tata Play (Tata Sky) Monthly & Annual Packs","name_ml":"ടാറ്റാ പ്ലേ റീച്ചാർജ്ജ്"},{"id":"airtel-dth","name_en":"Airtel Digital TV DTH Recharges","name_ml":"എയർടെൽ ഡിജിറ്റൽ ടിവി"},{"id":"dish-tv","name_en":"Dish TV & d2h Quick Recharges","name_ml":"ഡിഷ് ടിവി റീച്ചാർജ്ജ്"}]'::jsonb,
  'All direct-to-home television subscribers.', 'എല്ലാ ഡി.ടി.എച്ച് ഉപഭോക്താക്കൾക്കും.', '1. Enter Smart Card / Subscriber ID
2. Select package / enter amount
3. Instant channel activation.', '1. ഐഡി നൽകി തുക നിശ്ചയിക്കുന്നു
2. റീച്ചാർജ്ജ് ചെയ്യുന്നു
3. തൽക്ഷണം ചാനലുകൾ ആക്ടീവ് ആകുന്നു.',
  'Authorized DTH Integrators', 'https://wa.me/918086380373', 0, 0,
  'Instant within 1 minute', '1 മിനിറ്റിൽ തത്സമയം ചാനലുകൾ ലഭിക്കുന്നു', '2026-11-01'
);
INSERT INTO service_documents (service_key, name_en, name_ml, is_mandatory) VALUES ('tv-recharge', 'DTH Smart Card Number / Subscriber ID / Customer ID', 'സ്മാർട്ട് കാർഡ് നമ്പർ / സബ്സ്ക്രൈബർ ഐഡി', true);

INSERT INTO services (
  service_key, category_id, category_name_en, category_name_ml, number,
  name_en, name_ml, description_en, description_ml, subservices,
  eligibility_en, eligibility_ml, procedure_en, procedure_ml,
  official_portal_name, official_portal_url, govt_fee, nexa_service_charge,
  processing_time_en, processing_time_ml, last_verified_date
) VALUES (
  'pravasi-services', 'travel', 'Travel & Other Services', 'യാത്ര & മറ്റ് സേവനങ്ങൾ', 40,
  'Pravasi Services', 'പ്രവാസി സർവീസുകൾ (നോർക്ക & പ്രവാസി ക്ഷേമം)', 'NORKA Roots Pravasi ID Card, Pravasi Welfare Board pension, Santhwana financial aid, and attestation guidance.', 'നോർക്ക (NORKA Roots) പ്രവാസി ഐഡി കാർഡ്, പ്രവാസി ക്ഷേമനിധി പെൻഷൻ, സാന്ത്വന പദ്ധതി, സർട്ടിഫിക്കറ്റ് അറ്റസ്റ്റേഷൻ.', '[{"id":"norka-id","name_en":"NORKA Pravasi Identity Card (Active NRKs)","name_ml":"നോർക്ക പ്രവാസി ഐഡി കാർഡ്"},{"id":"pravasi-raksha","name_en":"NORKA Pravasi Raksha Insurance Scheme Enrollment","name_ml":"പ്രവാസി രക്ഷാ ഇൻഷുറൻസ്"},{"id":"pravasi-pension","name_en":"Kerala Non-Resident Keralites Welfare Board Pension Scheme","name_ml":"പ്രവാസി ക്ഷേമനിധി പെൻഷൻ അംഗത്വം"},{"id":"ndprem-rehabilitation","name_en":"NDPREM Returnee Migrant Self-Employment Loan Subsidy","name_ml":"തിരിച്ചെത്തിയ പ്രവാസികൾക്കുള്ള സ്വയംതൊഴിൽ വായ്പാ സബ്സിഡി"},{"id":"attestation","name_en":"HRD / NORKA Certificate Attestation & Apostille Guidance","name_ml":"നോർക്ക സർട്ടിഫിക്കറ്റ് അറ്റസ്റ്റേഷൻ"}]'::jsonb,
  'Non-Resident Keralites (NRKs) working abroad or other states for minimum 6 months, and returnee migrants.', 'വിദേശത്ത് കുറഞ്ഞത് 6 മാസമെങ്കിലും ജോലി ചെയ്യുന്ന പ്രവാസികൾക്കും നാട്ടിൽ തിരിച്ചെത്തിയവർക്കും.', '1. Online application on NORKA Roots portal
2. Verification of passport and visa credentials
3. Approval and digital card download / physical card dispatch.', '1. നോർക്ക പോർട്ടലിൽ അപേക്ഷ നൽകുന്നു
2. പാസ്പോർട്ടും വിസയും പരിശോധിക്കുന്നു
3. കാർഡ് അംഗീകരിക്കപ്പെട്ട് ലഭ്യമാക്കുന്നു.',
  'NORKA Roots Official Portal', 'https://norkaroots.kerala.gov.in', 354, 80,
  '7 to 15 working days', '7 മുതൽ 15 പ്രവൃത്തിദിനങ്ങൾ', '2026-11-01'
);
INSERT INTO service_documents (service_key, name_en, name_ml, is_mandatory) VALUES ('pravasi-services', 'Valid Indian Passport copy (Front & Back address page)', 'സാധുവായ പാസ്പോർട്ട് കോപ്പി', true);
INSERT INTO service_documents (service_key, name_en, name_ml, is_mandatory) VALUES ('pravasi-services', 'Valid Employment Visa / Residence Permit (Iqama / Emirates ID / Civil ID) copy', 'വിദേശ വിസ / റെസിഡൻസ് പെർമിറ്റ് കോപ്പി', true);
INSERT INTO service_documents (service_key, name_en, name_ml, is_mandatory) VALUES ('pravasi-services', 'Aadhaar Card copy (Kerala domicile address)', 'ആധാർ കാർഡ് കോപ്പി', true);
INSERT INTO service_documents (service_key, name_en, name_ml, is_mandatory) VALUES ('pravasi-services', 'Passport size color photograph with white background', 'വെള്ള പശ്ചാത്തലമുള്ള പാസ്പോർട്ട് സൈസ് ഫോട്ടോ', true);

INSERT INTO services (
  service_key, category_id, category_name_en, category_name_ml, number,
  name_en, name_ml, description_en, description_ml, subservices,
  eligibility_en, eligibility_ml, procedure_en, procedure_ml,
  official_portal_name, official_portal_url, govt_fee, nexa_service_charge,
  processing_time_en, processing_time_ml, last_verified_date
) VALUES (
  'travel-services', 'travel', 'Travel & Other Services', 'യാത്ര & മറ്റ് സേവനങ്ങൾ', 41,
  'Travel Services', 'ട്രാവൽ സർവീസുകൾ (ഫ്ലൈറ്റ് & ട്രെയിൻ ടിക്കറ്റുകൾ)', 'Domestic and international flight ticketing, IRCTC authorized train bookings, and travel visa application support.', 'വിമാന ടിക്കറ്റുകൾ, ട്രെയിൻ ടിക്കറ്റ് ബുക്കിംഗ് (IRCTC), സന്ദർശക വിസ സഹായം.', '[{"id":"flight-booking","name_en":"Domestic & International Flight Ticket Booking","name_ml":"വിമാന ടിക്കറ്റ് ബുക്കിംഗ്"},{"id":"train-booking","name_en":"IRCTC Authorized Train Ticket Reservation (General & Tatkal)","name_ml":"ട്രെയിൻ ടിക്കറ്റ് ബുക്കിംഗ് (IRCTC)"},{"id":"visit-visa","name_en":"Tourist & Visit Visa Application Guidance (UAE, Saudi, Oman, Qatar)","name_ml":"സന്ദർശക വിസ അപേക്ഷാ സഹായം"},{"id":"travel-insurance","name_en":"Overseas Travel & Medical Insurance","name_ml":"ട്രാവൽ ഇൻഷുറൻസ്"}]'::jsonb,
  'All travelers needing air, rail, or visa arrangements.', 'എല്ലാ യാത്രക്കാർക്കും.', '1. Search best available fare options
2. Selection of convenient schedule and baggage allowance
3. Instant ticket generation and WhatsApp delivery.', '1. മികച്ച യാത്രാ നിരക്കുകൾ പരിശോധിക്കുന്നു
2. അനുയോജ്യമായ സമയം തെരഞ്ഞെടുക്കുന്നു
3. ടിക്കറ്റ് ബുക്ക് ചെയ്ത് വാട്സാപ്പിൽ നൽകുന്നു.',
  'IRCTC & Airline Desks', 'https://www.irctc.co.in', 0, 50,
  'Instant ticket generation', 'തത്സമയം ടിക്കറ്റ് ലഭ്യമാക്കുന്നു', '2026-11-01'
);
INSERT INTO service_documents (service_key, name_en, name_ml, is_mandatory) VALUES ('travel-services', 'Valid Passport (for International flights / Visas)', 'പാസ്പോർട്ട് (വിദേശ യാത്രകൾക്ക്)', false);
INSERT INTO service_documents (service_key, name_en, name_ml, is_mandatory) VALUES ('travel-services', 'Government Photo ID (Aadhaar / Voter ID for domestic travel)', 'തിരിച്ചറിയൽ രേഖ (ആധാർ)', true);
INSERT INTO service_documents (service_key, name_en, name_ml, is_mandatory) VALUES ('travel-services', 'Travel Dates, Departure & Destination Details', 'യാത്രാ തീയതികളും റൂട്ടും', true);

INSERT INTO services (
  service_key, category_id, category_name_en, category_name_ml, number,
  name_en, name_ml, description_en, description_ml, subservices,
  eligibility_en, eligibility_ml, procedure_en, procedure_ml,
  official_portal_name, official_portal_url, govt_fee, nexa_service_charge,
  processing_time_en, processing_time_ml, last_verified_date
) VALUES (
  'ksrtc-bus-booking', 'travel', 'Travel & Other Services', 'യാത്ര & മറ്റ് സേവനങ്ങൾ', 42,
  'KSRTC Bus Booking', 'കെ.എസ്.ആർ.ടി.സി ബസ് ടിക്കറ്റ് ബുക്കിംഗ്', 'Official KSRTC Swift, Super Deluxe, Minnal, and Low-Floor AC bus seat reservation and cancellation tracking.', 'കെ.എസ്.ആർ.ടി.സി സ്വിഫ്റ്റ്, സൂപ്പർ ഡീലക്സ്, മിന്നൽ, എ.സി ബസ് ടിക്കറ്റ് ബുക്കിംഗ്.', '[{"id":"swift-booking","name_en":"KSRTC Swift Long-Distance Bus Reservation","name_ml":"സ്വിഫ്റ്റ് ബസ് ടിക്കറ്റ് ബുക്കിംഗ്"},{"id":"interstate-ksrtc","name_en":"Interstate Services (Bengaluru, Chennai, Mysuru, Coimbatore)","name_ml":"അന്യസംസ്ഥാന സർവീസുകൾ"},{"id":"deluxe-minnal","name_en":"Super Fast, Super Deluxe, and Minnal Seat Booking","name_ml":"സൂപ്പർ ഡീലക്സ്, മിന്നൽ സർവീസുകൾ"},{"id":"cancellation","name_en":"Ticket Cancellation & Refund Assistance","name_ml":"ടിക്കറ്റ് ക്യാൻസലേഷൻ & റീഫണ്ട്"}]'::jsonb,
  'All public transport passengers.', 'എല്ലാ ബസ് യാത്രക്കാർക്കും.', '1. Real-time route and seat availability lookup
2. Seat selection
3. Secure payment
4. M-Ticket sent via SMS and PDF receipt via WhatsApp.', '1. റൂട്ടും സീറ്റും പരിശോധിക്കുന്നു
2. ഇഷ്ടമുള്ള സീറ്റ് തെരഞ്ഞെടുക്കുന്നു
3. ടിക്കറ്റ് ബുക്ക് ചെയ്ത് ഫോണിലേക്ക് മെസ്സേജായി ലഭിക്കുന്നു.',
  'KSRTC Online Booking Portal (onlineksrtcswift.com)', 'https://onlineksrtcswift.com', 0, 25,
  'Instant M-Ticket issuance', 'തത്സമയം ടിക്കറ്റ് ലഭിക്കുന്നു', '2026-11-01'
);
INSERT INTO service_documents (service_key, name_en, name_ml, is_mandatory) VALUES ('ksrtc-bus-booking', 'Passenger Name, Age, and Gender', 'യാത്രക്കാരുടെ പേര്, പ്രായം', true);
INSERT INTO service_documents (service_key, name_en, name_ml, is_mandatory) VALUES ('ksrtc-bus-booking', 'Active Mobile Number for SMS ticket delivery', 'മൊബൈൽ നമ്പർ', true);
INSERT INTO service_documents (service_key, name_en, name_ml, is_mandatory) VALUES ('ksrtc-bus-booking', 'Boarding and Destination points', 'കയറുന്ന സ്ഥലവും ഇറങ്ങേണ്ട സ്ഥലവും', true);

INSERT INTO services (
  service_key, category_id, category_name_en, category_name_ml, number,
  name_en, name_ml, description_en, description_ml, subservices,
  eligibility_en, eligibility_ml, procedure_en, procedure_ml,
  official_portal_name, official_portal_url, govt_fee, nexa_service_charge,
  processing_time_en, processing_time_ml, last_verified_date
) VALUES (
  'farmers-related-services', 'travel', 'Travel & Other Services', 'യാത്ര & മറ്റ് സേവനങ്ങൾ', 43,
  'Farmers Related Services', 'കർഷക സേവനങ്ങൾ (AIMS & PM-KISAN)', 'PM-KISAN Samman Nidhi e-KYC, AIMS Kerala Farmer Portal registration, Crop Insurance, and agricultural welfare.', 'പി.എം കിസാൻ ഇ-കെ.വൈ.സി, എയിംസ് (AIMS) കർഷക രജിസ്ട്രേഷൻ, വിള ഇൻഷുറൻസ്, സബ്സിഡികൾ.', '[{"id":"pm-kisan-ekyc","name_en":"PM-KISAN e-KYC Biometric / OTP Updation","name_ml":"പി.എം കിസാൻ ഇ-കെ.വൈ.സി (e-KYC)"},{"id":"aims-registration","name_en":"AIMS Kerala Karshaka Registration","name_ml":"എയിംസ് (AIMS) കർഷക രജിസ്ട്രേഷൻ"},{"id":"crop-insurance","name_en":"State Crop Insurance Scheme (വിള ഇൻഷുറൻസ്)","name_ml":"വിള ഇൻഷുറൻസ് അപേക്ഷ"},{"id":"pm-kisan-new","name_en":"PM-KISAN New Farmer Registration","name_ml":"പുതിയ പി.എം കിസാൻ രജിസ്ട്രേഷൻ"}]'::jsonb,
  'Cultivating farmers and landowning agriculturists in Kerala.', 'കേരളത്തിലെ കൃഷിക്കാർക്കും ഭൂവുടമകളായ കർഷകർക്കും.', '1. Land and bank details entry on AIMS / PM-KISAN portal
2. Aadhaar e-KYC validation
3. Verification by Agricultural Officer at Krishi Bhavan
4. Direct Benefit Transfer of eligible financial aid.', '1. പോർട്ടലിൽ കൃഷി, ബാങ്ക് വിവരങ്ങൾ നൽകുന്നു
2. ആധാർ ഇ-കെ.വൈ.സി പൂർത്തിയാക്കുന്നു
3. കൃഷി ഓഫീസറുടെ പരിശോധനയ്ക്ക് ശേഷം ആനുകൂല്യം നേരിട്ട് ബാങ്കിലെത്തുന്നു.',
  'Kerala Agriculture AIMS Portal & PM-KISAN', 'https://aims.kerala.gov.in', 0, 40,
  'Instant e-KYC | Application approval: 7 to 15 days', 'ഇ-കെ.വൈ.സി തത്സമയം | അപേക്ഷ അംഗീകാരം: 7-15 ദിവസങ്ങൾ', '2026-11-01'
);
INSERT INTO service_documents (service_key, name_en, name_ml, is_mandatory) VALUES ('farmers-related-services', 'Aadhaar Card linked to mobile number', 'ആധാർ കാർഡ്', true);
INSERT INTO service_documents (service_key, name_en, name_ml, is_mandatory) VALUES ('farmers-related-services', 'Current Land Tax Receipt / RoR / Thandapper record', 'നടപ്പുവർഷത്തെ ഭൂനികുതി രസീത്', true);
INSERT INTO service_documents (service_key, name_en, name_ml, is_mandatory) VALUES ('farmers-related-services', 'Bank Passbook with Aadhaar Seeding / NPCI Mapping', 'ആധാർ ലിങ്ക് ചെയ്ത ബാങ്ക് പാസ്ബുക്ക്', true);
INSERT INTO service_documents (service_key, name_en, name_ml, is_mandatory) VALUES ('farmers-related-services', 'Crop details and cultivated extent in Ares', 'കൃഷി വിവരങ്ങൾ', true);

-- ====================================================================
-- SEED DATA: MASTER FAQS
-- ====================================================================

INSERT INTO service_faqs (service_key, question_en, question_ml, answer_en, answer_ml)
VALUES ('general', 'Is Nexa Digital Services a government office or official government portal?', 'നെക്സ ഡിജിറ്റൽ സർവീസസ് ഒരു സർക്കാർ ഓഫീസോ ഔദ്യോഗിക സർക്കാർ പോർട്ടലോ ആണോ?', 'No. Nexa Digital Services is an authorized, independent private digital service and citizen facilitation centre (Akshaya / CSC style) based in Kerala. We assist citizens with online government portal navigation, document preparation, and application submission. We do not represent any government department or claim official authority.', 'അല്ല. നെക്സ ഡിജിറ്റൽ സർവീസസ് ഒരു സ്വതന്ത്ര സ്വകാര്യ പൗര സേവന കേന്ദ്രമാണ് (അക്ഷയ / CSC മാതൃക). സർക്കാർ പോർട്ടലുകളിൽ ഓൺലൈനായി അപേക്ഷ സമർപ്പിക്കാനും രേഖകൾ ഡിജിറ്റൈസ് ചെയ്യാനും പൗരന്മാരെ സഹായിക്കുക മാത്രമാണ് ഞങ്ങൾ ചെയ്യുന്നത്. ഞങ്ങൾ സർക്കാർ ഓഫീസോ പ്രതിനിധികളോ അല്ല.');

INSERT INTO service_faqs (service_key, question_en, question_ml, answer_en, answer_ml)
VALUES ('aadhaar', 'Do you offer new Aadhaar card enrolment or biometric updates?', 'നിങ്ങൾ പുതിയ ആധാർ കാർഡ് എടുക്കലോ ബയോമെട്രിക് മാറ്റങ്ങളോ ചെയ്യാറുണ്ടോ?', 'No. As per UIDAI statutory regulations, new Aadhaar card enrolment and biometric updates (fingerprint, iris, facial updates, and child biometrics) can strictly be carried out only at designated official UIDAI centres, authorized banks, or designated post offices. We do not provide Aadhaar enrolment services.', 'ഇല്ല. കേന്ദ്ര സർക്കാരിന്റെയും UIDAI യുടെയും കർശന നിർദ്ദേശങ്ങൾ പ്രകാരം പുതിയ ആധാർ എടുക്കുന്നതും ബയോമെട്രിക് (വിരലടയാളം, കണ്ണ്, ഫോട്ടോ) മാറ്റങ്ങളും ബാങ്കുകളിലോ തപാൽ ഓഫീസുകളിലോ ഉള്ള ഔദ്യോഗിക ആധാർ കേന്ദ്രങ്ങളിൽ മാത്രമേ സാധിക്കൂ. ഞങ്ങൾ ആധാർ എൻറോൾമെന്റ് സേവനങ്ങൾ നൽകാറില്ല.');

INSERT INTO service_faqs (service_key, question_en, question_ml, answer_en, answer_ml)
VALUES ('fees', 'What is the difference between Government Fees and Nexa Service Charges?', 'സർക്കാർ ഫീസും നെക്സ സർവീസ് ചാർജ്ജും തമ്മിലുള്ള വ്യത്യാസം എന്താണ്?', 'Government Fees are the mandatory statutory charges collected directly by the respective government department or portal (for which an official treasury or department receipt is issued). Nexa Service Charges are the nominal facilitation and consultation charges for our operator assistance, computer systems, document scanning, and application drafting. We maintain 100% transparent fee breakdowns with zero hidden costs.', 'സർക്കാർ ഫീസ് എന്നത് അതത് സർക്കാർ വകുപ്പുകൾക്ക് നൽകേണ്ട നിയമാനുസൃത ഫീസാണ് (ഇതിന് ഔദ്യോഗിക സർക്കാർ രസീത് ലഭ്യമാകും). നെക്സ സർവീസ് ചാർജ്ജ് എന്നത് കമ്പ്യൂട്ടർ ഉപയോഗം, സ്കാനിംഗ്, അപേക്ഷ പൂരിപ്പിക്കൽ എന്നിവയ്ക്കുള്ള നാമമാത്രമായ സേവന നിരക്കാണ്. എല്ലാ നിരക്കുകളും പൂർണ്ണ സുതാര്യതയോടെ മുൻകൂട്ടി വ്യക്തമാക്കുന്നു.');

INSERT INTO service_faqs (service_key, question_en, question_ml, answer_en, answer_ml)
VALUES ('passport-services', 'How quickly can I get a passport through Nexa?', 'നെക്സ വഴി എത്ര പെട്ടെന്ന് പാസ്പോർട്ട് ലഭിക്കും?', 'We assist with immediate form filing and PSK appointment slot booking (often within 24 hours depending on Passport Seva Kendra vacancy). Under normal application, the passport typically arrives in 15-20 days following police verification. Under Tatkaal, it can arrive within 3-5 days. Note that final issuance is strictly determined by the Regional Passport Office and police verification authorities.', 'ഞങ്ങൾ 24 മണിക്കൂറിനകം അപേക്ഷ പൂർത്തിയാക്കി PSK അപ്പോയിന്റ്മെന്റ് സ്ലോട്ട് ബുക്ക് ചെയ്തു നൽകുന്നു. സാധാരണ അപേക്ഷയിൽ പോലീസ് വെരിഫിക്കേഷന് ശേഷം 15-20 ദിവസത്തിനകം പാസ്പോർട്ട് വീട്ടിലെത്തും. തത്കാൽ ആണെങ്കിൽ 3-5 ദിവസത്തിനകം ലഭിക്കും. അന്തിമ അംഗീകാരം പാസ്പോർട്ട് ഓഫീസിന്റെയും പോലീസിന്റെയും തീരുമാനപ്രകാരമായിരിക്കും.');

INSERT INTO service_faqs (service_key, question_en, question_ml, answer_en, answer_ml)
VALUES ('village-services', 'What documents are required for an Income Certificate in Kerala?', 'കേരളത്തിൽ വരുമാന സർട്ടിഫിക്കറ്റിന് എന്തൊക്കെ രേഖകൾ വേണം?', 'To apply for an e-District Income Certificate, you generally need: 1. Aadhaar Card copy, 2. Ration Card copy, 3. Salary Certificate (if employed in organized sector) or Pension Book or declaration, 4. Land Tax Receipt (if owning land), and 5. Passport size photograph. The application is reviewed by the Village Officer and Revenue Inspector.', 'ഇ-ഡിസ്ട്രിക്റ്റ് വരുമാന സർട്ടിഫിക്കറ്റിന്: 1. ആധാർ കാർഡ്, 2. റേഷൻ കാർഡ് കോപ്പി, 3. ശമ്പള സർട്ടിഫിക്കറ്റ് / പെൻഷൻ രേഖ / സ്വയംസാക്ഷ്യപത്രം, 4. ഭൂനികുതി രസീത് (സ്ഥലമുണ്ടെങ്കിൽ), 5. പാസ്പോർട്ട് സൈസ് ഫോട്ടോ എന്നിവ ആവശ്യമാണ്. വില്ലേജ് ഓഫീസറുടെ പരിശോധനയ്ക്ക് ശേഷമാണ് സർട്ടിഫിക്കറ്റ് ലഭിക്കുക.');

INSERT INTO service_faqs (service_key, question_en, question_ml, answer_en, answer_ml)
VALUES ('security', 'Will Nexa ever ask for my banking OTP, ATM PIN, or passwords?', 'നെക്സ ജീവനക്കാരോ ചാറ്റ്ബോട്ടോ എന്റെ ഒ.ടി.പിയോ ബാങ്ക് പിൻ നമ്പറോ ചോദിക്കുമോ?', 'NEVER. Nexa Digital Services and our AI assistant will NEVER request your banking passwords, ATM PINs, UPI PINs, or confidential login passwords. When an application portal requires an Aadhaar OTP or portal verification OTP, we will only prompt you to enter it yourself or verify it during active application submission with your consent. Never share secret passwords with anyone.', 'ഒരിക്കലുമില്ല. നെക്സ ഡിജിറ്റൽ സർവീസസോ ഞങ്ങളുടെ AI അസിസ്റ്റന്റോ നിങ്ങളുടെ ബാങ്ക് പാസ്‌വേഡുകളോ എ.ടി.എം പിന്നോ യു.പി.ഐ പിന്നോ രഹസ്യ പാസ്‌വേഡുകളോ ചോദിക്കില്ല. സർക്കാർ പോർട്ടലിൽ അപേക്ഷിക്കുമ്പോൾ മൊബൈലിൽ വരുന്ന ആധാർ ഒ.ടി.പി മാത്രമേ അപേക്ഷകന്റെ സമ്മതത്തോടെ അപേക്ഷ സമർപ്പിക്കാൻ ഉപയോഗിക്കൂ.');
