import React, { useState } from 'react';
import { X, Send, CheckCircle2, MessageCircle, AlertCircle, Phone, Sparkles } from 'lucide-react';
import { ServiceItem, Language, EnquirySubmission } from '../types';
import { UI_TEXT } from '../utils/language';
import { submitCustomerEnquiry } from '../utils/api';
import { BUSINESS_WHATSAPP_DISPLAY } from '../utils/whatsapp';

interface EnquiryModalProps {
  service: ServiceItem | null;
  subserviceName?: string;
  language: Language;
  onClose: () => void;
  onSuccess: (refId: string, whatsappUrl: string) => void;
}

export const EnquiryModal: React.FC<EnquiryModalProps> = ({
  service,
  subserviceName,
  language,
  onClose,
  onSuccess
}) => {
  const text = UI_TEXT[language];
  const isMl = language === 'ml';

  const [customerName, setCustomerName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [applicationType, setApplicationType] = useState(
    subserviceName || (service?.subservices?.[0] ? (isMl ? service.subservices[0].name_ml : service.subservices[0].name_en) : 'General Application')
  );
  const [shortDescription, setShortDescription] = useState('');
  const [preferredContact, setPreferredContact] = useState<'whatsapp' | 'call'>('whatsapp');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [createdResult, setCreatedResult] = useState<{ reference_id: string; whatsapp_url: string } | null>(null);

  const validateForm = () => {
    if (!customerName.trim()) {
      setErrorMessage(isMl ? 'ദയവായി നിങ്ങളുടെ പേര് നൽകുക.' : 'Please enter your name.');
      return false;
    }
    const cleanPhone = mobileNumber.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setErrorMessage(isMl ? 'ദയവായി 10 അക്ക മൊബൈൽ നമ്പർ നൽകുക.' : 'Please enter a valid 10-digit mobile number.');
      return false;
    }
    setErrorMessage('');
    return true;
  };

  const handleProceedToConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setShowConfirmation(true);
    }
  };

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const payload: EnquirySubmission = {
        customer_name: customerName.trim(),
        mobile_number: mobileNumber.trim(),
        service_key: service?.id || 'general',
        service_name: service ? (isMl ? service.name_ml : service.name_en) : 'General Service Inquiry',
        application_type: applicationType,
        short_description: shortDescription.trim(),
        preferred_contact_method: preferredContact,
        preferred_language: language
      };

      const result = await submitCustomerEnquiry(payload);
      setCreatedResult({
        reference_id: result.reference_id,
        whatsapp_url: result.whatsapp_url
      });
      onSuccess(result.reference_id, result.whatsapp_url);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to submit enquiry. Please try again.');
      setShowConfirmation(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-slate-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#01284b] to-[#0453cd] text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-300" />
            <h3 className="font-bold text-base text-white">
              {text.enquiryTitle}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Success View */}
        {createdResult ? (
          <div className="p-6 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <h4 className="text-lg font-bold text-slate-900">
                {text.enquirySuccess}
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                {isMl ? 'താങ്കളുടെ അപേക്ഷാ അന്വേഷണം ഞങ്ങളുടെ ഡെസ്കിൽ രേഖപ്പെടുത്തിയിട്ടുണ്ട്.' : 'Your enquiry has been successfully logged with our customer service desk.'}
              </p>
            </div>

            <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl">
              <span className="text-[11px] font-medium text-blue-700 uppercase tracking-wider block">
                {text.refNumber}
              </span>
              <span className="text-xl font-extrabold text-[#01284b] tracking-wider select-all font-mono">
                {createdResult.reference_id}
              </span>
            </div>

            <p className="text-xs text-slate-600">
              {isMl
                ? 'താഴെയുള്ള ബട്ടൺ ക്ലിക്ക് ചെയ്ത് ഞങ്ങളുടെ ഔദ്യോഗിക വാട്സാപ്പിലേക്ക് ഈ അന്വേഷണം നേരിട്ട് അയക്കാവുന്നതാണ്:'
                : 'Click below to open WhatsApp with your pre-filled enquiry reference:'}
            </p>

            <a
              href={createdResult.whatsapp_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 bg-[#128C7E] hover:bg-[#075E54] text-white rounded-xl text-sm font-bold shadow-lg hover:shadow-xl transition-all cursor-pointer"
            >
              <MessageCircle className="w-5 h-5" />
              <span>{text.openWhatsApp} ({BUSINESS_WHATSAPP_DISPLAY})</span>
            </a>

            <button
              onClick={onClose}
              className="text-xs text-slate-500 hover:text-slate-800 underline block mx-auto cursor-pointer"
            >
              {text.close}
            </button>
          </div>
        ) : showConfirmation ? (
          /* Confirmation Preview View */
          <div className="p-5 space-y-4 text-sm text-slate-700">
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900">
              {isMl
                ? 'ദയവായി നൽകിയ വിവരങ്ങൾ ശരിയാണോ എന്ന് പരിശോധിക്കുക:'
                : 'Please verify your enquiry details before final submission:'}
            </div>

            <div className="space-y-2 bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">{text.nameLabel}:</span>
                <span className="font-bold text-slate-900">{customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">{text.phoneLabel}:</span>
                <span className="font-bold text-slate-900">{mobileNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">{text.serviceLabel}:</span>
                <span className="font-bold text-slate-900">{service ? (isMl ? service.name_ml : service.name_en) : 'General'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">{text.applicationTypeLabel}:</span>
                <span className="font-bold text-blue-700">{applicationType}</span>
              </div>
              {shortDescription && (
                <div className="pt-2 border-t border-slate-200 text-[11px] text-slate-600">
                  <strong>{text.detailsLabel}:</strong> {shortDescription}
                </div>
              )}
            </div>

            {errorMessage && (
              <div className="p-2.5 bg-red-50 text-red-700 rounded-lg text-xs flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowConfirmation(false)}
                disabled={isSubmitting}
                className="flex-1 py-2.5 border border-slate-300 hover:bg-slate-100 rounded-xl text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
              >
                {isMl ? 'തിരുത്തുക' : 'Edit Details'}
              </button>

              <button
                type="button"
                onClick={handleFinalSubmit}
                disabled={isSubmitting}
                className="flex-1 py-2.5 bg-[#0453cd] hover:bg-[#01284b] text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>{isMl ? 'സമർപ്പിക്കുന്നു...' : 'Submitting...'}</span>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>{text.submitEnquiry}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          /* Form Entry View */
          <form onSubmit={handleProceedToConfirm} className="p-5 space-y-3.5 text-xs">
            {errorMessage && (
              <div className="p-2.5 bg-red-50 text-red-700 rounded-lg text-xs flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Pre-selected Service banner */}
            <div className="p-2.5 bg-blue-50 border border-blue-200/80 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-[10px] text-blue-600 font-semibold uppercase">{text.serviceLabel}</span>
                <h4 className="font-bold text-slate-900 text-xs mt-0.5 truncate max-w-[260px]">
                  {service ? (isMl ? service.name_ml : service.name_en) : 'General Citizen Service'}
                </h4>
              </div>
              <span className="text-[11px] font-bold text-[#0453cd]">
                ₹{service?.govt_fee || 0} + ₹{service?.nexa_service_charge || 0}
              </span>
            </div>

            {/* Subservice / Specific Application Selection */}
            {service?.subservices && service.subservices.length > 0 && (
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  {text.applicationTypeLabel} *
                </label>
                <select
                  value={applicationType}
                  onChange={(e) => setApplicationType(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-xs bg-white text-slate-900"
                >
                  {service.subservices.map(sub => (
                    <option key={sub.id} value={isMl ? sub.name_ml : sub.name_en}>
                      {isMl ? sub.name_ml : sub.name_en}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Name */}
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                {text.nameLabel} *
              </label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder={isMl ? 'ഉദാ: രാഹുൽ കൃഷ്ണൻ' : 'e.g. Rahul Krishnan'}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-xs"
              />
            </div>

            {/* Mobile Number */}
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                {text.phoneLabel} *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-slate-400 font-medium">+91</span>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ''))}
                  placeholder="8086380373"
                  className="w-full pl-11 pr-3 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-xs"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                {text.detailsLabel}
              </label>
              <textarea
                rows={2}
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                placeholder={isMl ? 'നിങ്ങളുടെ പ്രത്യേക ആവശ്യങ്ങൾ ഉണ്ടെങ്കിൽ ഇവിടെ രേഖപ്പെടുത്താം...' : 'Any specific notes or details for our desk...'}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-xs resize-none"
              />
            </div>

            {/* Preferred Contact Method */}
            <div className="pt-1">
              <label className="font-semibold text-slate-700 block mb-1.5">
                {isMl ? 'ബന്ധപ്പെടാൻ താൽപ്പര്യമുള്ള രീതി:' : 'Preferred Contact Method:'}
              </label>
              <div className="grid grid-cols-2 gap-2">
                <label className={`flex items-center gap-2 p-2 rounded-xl border cursor-pointer transition-all ${preferredContact === 'whatsapp' ? 'bg-emerald-50 border-emerald-500 text-emerald-900 font-semibold' : 'border-slate-200 text-slate-600'}`}>
                  <input
                    type="radio"
                    name="contactMethod"
                    checked={preferredContact === 'whatsapp'}
                    onChange={() => setPreferredContact('whatsapp')}
                    className="accent-emerald-600"
                  />
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>WhatsApp</span>
                </label>

                <label className={`flex items-center gap-2 p-2 rounded-xl border cursor-pointer transition-all ${preferredContact === 'call' ? 'bg-blue-50 border-blue-500 text-blue-900 font-semibold' : 'border-slate-200 text-slate-600'}`}>
                  <input
                    type="radio"
                    name="contactMethod"
                    checked={preferredContact === 'call'}
                    onChange={() => setPreferredContact('call')}
                    className="accent-blue-600"
                  />
                  <Phone className="w-3.5 h-3.5 text-blue-600" />
                  <span>{isMl ? 'ഫോൺ കോൾ' : 'Phone Call'}</span>
                </label>
              </div>
            </div>

            {/* Privacy Protection Banner */}
            <div className="text-[10px] text-slate-500 leading-tight bg-slate-50 p-2 rounded-lg border border-slate-200">
              🔒 {isMl
                ? 'നിങ്ങളുടെ വിവരങ്ങൾ അപേക്ഷാ ആവശ്യങ്ങൾക്ക് മാത്രമേ ഉപയോഗിക്കൂ. രഹസ്യ പാസ്‌വേഡുകളോ ബാങ്ക് ഒ.ടി.പികളോ നെക്സ ആവശ്യപ്പെടില്ല.'
                : 'Your details are strictly used for application assistance. Nexa never requests banking PINs or OTPs.'}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full mt-2 py-2.5 bg-gradient-to-r from-[#01284b] to-[#0453cd] hover:from-[#0453cd] hover:to-[#01284b] text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span>{isMl ? 'വിവരങ്ങൾ പരിശോധിക്കുക' : 'Review & Confirm Enquiry'}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
