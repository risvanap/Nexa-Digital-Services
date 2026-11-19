import { Message, ServiceItem, ServiceCategory, EnquirySubmission, EnquiryRecord, DashboardStats, FAQItem } from '../types';

const API_BASE = '/api';

export async function sendMessageToAi(payload: {
  message: string;
  history: Message[];
  language?: string;
}): Promise<{
  reply: string;
  language: 'ml' | 'en';
  matchedService: ServiceItem | null;
  suggestedReplies: string[];
  action: string;
}> {
  const res = await fetch(`${API_BASE}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.error || 'Failed to get response from AI');
  }

  return json.data;
}

export async function submitCustomerEnquiry(payload: EnquirySubmission): Promise<{
  id: string;
  reference_id: string;
  customer_name: string;
  service_name: string;
  whatsapp_url: string;
}> {
  const res = await fetch(`${API_BASE}/enquiries`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.error || 'Failed to submit enquiry');
  }

  return json.data;
}

export async function fetchServices(params?: { category?: string; search?: string }): Promise<{
  categories: ServiceCategory[];
  services: ServiceItem[];
}> {
  const query = new URLSearchParams();
  if (params?.category) query.append('category', params.category);
  if (params?.search) query.append('search', params.search);

  const res = await fetch(`${API_BASE}/services?${query.toString()}`);
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.error || 'Failed to fetch services');
  }

  return {
    categories: json.categories || [],
    services: json.data || []
  };
}

export async function fetchServiceById(id: string): Promise<ServiceItem> {
  const res = await fetch(`${API_BASE}/services/${id}`);
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.error || 'Service not found');
  }
  return json.data;
}

export async function fetchEnquiries(params?: {
  status?: string;
  search?: string;
  limit?: number;
  offset?: number;
}): Promise<{ data: EnquiryRecord[]; total: number }> {
  const query = new URLSearchParams();
  if (params?.status) query.append('status', params.status);
  if (params?.search) query.append('search', params.search);
  if (params?.limit) query.append('limit', String(params.limit));
  if (params?.offset) query.append('offset', String(params.offset));

  const res = await fetch(`${API_BASE}/enquiries?${query.toString()}`);
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.error || 'Failed to fetch enquiries');
  }
  return { data: json.data || [], total: json.total || 0 };
}

export async function updateEnquiryStatus(
  id: string,
  updates: { status?: string; internal_notes?: string; assigned_to?: string }
): Promise<EnquiryRecord> {
  const res = await fetch(`${API_BASE}/enquiries/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates)
  });

  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.error || 'Failed to update enquiry');
  }
  return json.data;
}

export async function fetchDashboardStats(): Promise<DashboardStats> {
  const res = await fetch(`${API_BASE}/stats`);
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.error || 'Failed to fetch dashboard stats');
  }
  return json.data;
}

export async function fetchFaqs(): Promise<FAQItem[]> {
  const res = await fetch(`${API_BASE}/faqs`);
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.error || 'Failed to fetch FAQs');
  }
  return json.data;
}

export async function createFaq(faq: Partial<FAQItem>): Promise<FAQItem> {
  const res = await fetch(`${API_BASE}/faqs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(faq)
  });
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.error || 'Failed to create FAQ');
  }
  return json.data;
}

export async function deleteFaq(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/faqs/${id}`, { method: 'DELETE' });
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.error || 'Failed to delete FAQ');
  }
}
