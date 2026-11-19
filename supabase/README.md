# NEXA DIGITAL SERVICES – Supabase Database Setup Guide

This directory contains the complete database schema, Row Level Security (RLS) policies, indexes, and seed data for **NEXA DIGITAL SERVICES AI Customer Support Assistant**.

---

## 📋 Database Tables Summary

1. `services` (Master catalog of all 43 services across 7 categories)
2. `service_documents` (Mandatory and optional document checklists per service)
3. `service_faqs` (Bilingual Malayalam & English FAQs for AI knowledge base)
4. `customer_enquiries` (Customer leads, applications, and support tickets with unique reference IDs like `NX-2026-XXXX`)
5. `enquiry_messages` (Chat messages associated with customer enquiries)
6. `admin_users` (Administrator profiles with Supabase Auth linkage)
7. `chatbot_settings` (AI Model configuration and business credentials)

---

## 🚀 Quick Setup Instructions (3 Steps)

### Step 1: Create a Supabase Project
1. Go to [https://supabase.com](https://supabase.com) and log in or create a free account.
2. Click **New Project**.
3. Name your project (e.g. `nexa-digital-services`), set a secure database password, and select region **South Asia (Mumbai - ap-south-1)** for lowest latency in Kerala.

### Step 2: Run the SQL Schema
1. In your Supabase Dashboard, navigate to the **SQL Editor** tab from the left sidebar.
2. Click **New Query**.
3. Open [`supabase/schema.sql`](./schema.sql) in this directory, copy its entire contents, paste it into the Supabase SQL editor, and click **RUN**.
4. The script will create all 7 tables, build indexes, enable Row Level Security, and automatically seed all **43 services** and master FAQs!

### Step 3: Copy API Credentials to `.env`
1. In Supabase Dashboard, go to **Project Settings** -> **API**.
2. Copy your **Project URL** and paste it into `.env`:
   ```env
   SUPABASE_URL=https://your-project-id.supabase.co
   ```
3. Copy your **anon public key** and **service_role secret key**:
   ```env
   SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6...
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6...
   ```
4. Restart your application server:
   ```bash
   npm start
   ```

---

## 🔒 Row Level Security (RLS) Policies

All tables have Row Level Security enabled:
- **Public Visitors**: Can `SELECT` active services, documents, published FAQs, and `INSERT` customer enquiries. Visitors cannot read or edit customer data.
- **Authenticated Admins**: Have full `SELECT`, `INSERT`, `UPDATE`, and `DELETE` access to customer enquiries, service records, and settings.
