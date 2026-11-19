export const BUSINESS_WHATSAPP_NUMBER = '918086380373';
export const BUSINESS_WHATSAPP_DISPLAY = '+91 8086380373';

export function getDirectWhatsAppUrl(customMessage?: string): string {
  const defaultText = 'Hello NEXA DIGITAL SERVICES, I need assistance with online digital services.';
  const msg = customMessage || defaultText;
  return `https://wa.me/${BUSINESS_WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
}

export function getEnquiryWhatsAppUrl(enquiry: {
  reference_id: string;
  customer_name: string;
  service_name: string;
  application_type?: string;
  preferred_language?: string;
}): string {
  const isMl = enquiry.preferred_language === 'ml';
  const text = isMl
    ? `നമസ്കാരം NEXA DIGITAL SERVICES! 👋\n\nഎന്റെ അപേക്ഷാ അന്വേഷണ നമ്പർ: *${enquiry.reference_id}*\n\n• പേര്: ${enquiry.customer_name}\n• സേവനം: *${enquiry.service_name}*\n• പ്രത്യേക അപേക്ഷ: ${enquiry.application_type || 'ജനറൽ'}\n\nഈ അപേക്ഷയിൽ സഹായിക്കുമോ? നന്ദി.`
    : `Hello NEXA DIGITAL SERVICES! 👋\n\nMy Enquiry Reference: *${enquiry.reference_id}*\n\n• Name: ${enquiry.customer_name}\n• Service: *${enquiry.service_name}*\n• Application Type: ${enquiry.application_type || 'General'}\n\nCould you please assist me with this application? Thank you!`;

  return `https://wa.me/${BUSINESS_WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}
