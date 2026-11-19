export type Language = 'ml' | 'en';

export interface Subservice {
  id: string;
  name_en: string;
  name_ml: string;
}

export interface DocumentItem {
  name_en: string;
  name_ml: string;
  mandatory?: boolean;
}

export interface ServiceItem {
  id: string;
  number: number;
  category_id: string;
  category_name_en: string;
  category_name_ml: string;
  name_en: string;
  name_ml: string;
  description_en: string;
  description_ml: string;
  subservices: Subservice[];
  required_documents: DocumentItem[];
  eligibility_en?: string;
  eligibility_ml?: string;
  procedure_en?: string;
  procedure_ml?: string;
  official_portal_name?: string;
  official_portal_url?: string;
  govt_fee: number;
  nexa_service_charge: number;
  processing_time_en?: string;
  processing_time_ml?: string;
  last_verified_date?: string;
  is_active?: boolean;
}

export interface ServiceCategory {
  id: string;
  name_en: string;
  name_ml: string;
  icon: string;
}

export interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  language?: Language;
  matchedService?: ServiceItem | null;
  suggestedReplies?: string[];
  action?: string;
  isError?: boolean;
}

export interface EnquirySubmission {
  customer_name: string;
  mobile_number: string;
  service_key: string;
  service_name: string;
  application_type: string;
  short_description?: string;
  preferred_contact_method: 'whatsapp' | 'call';
  preferred_language: Language;
}

export interface EnquiryRecord {
  id: string;
  reference_id: string;
  customer_name: string;
  mobile_number: string;
  service_key: string;
  service_name: string;
  application_type: string;
  short_description: string;
  preferred_contact_method: string;
  preferred_language: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  internal_notes: string;
  assigned_to: string;
  whatsapp_sent: boolean;
  created_at: string;
  updated_at: string;
}

export interface FAQItem {
  id: string;
  service_id: string;
  question_en: string;
  question_ml: string;
  answer_en: string;
  answer_ml: string;
}

export interface DashboardStats {
  total: number;
  today: number;
  pending: number;
  in_progress: number;
  completed: number;
  total_services: number;
  recent: EnquiryRecord[];
}
