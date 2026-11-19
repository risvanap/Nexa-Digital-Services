import React from 'react';
import { X, CheckCircle, AlertTriangle, ExternalLink, Send, ShieldCheck, Clock, FileCheck } from 'lucide-react';
import { ServiceItem, Language } from '../types';
import { UI_TEXT } from '../utils/language';

interface DocumentCardProps {
  service: ServiceItem | null;
  language: Language;
  onClose: () => void;
  onApply: (service: ServiceItem) => void;
}

export const DocumentCard: React.FC<DocumentCardProps> = ({
  service,
  language,
  onClose,
  onApply
}) => {
  if (!service) return null;
  const isMl = language === 'ml';
  const text = UI_TEXT[language];

  const serviceName = isMl ? service.name_ml : service.name_en;
  const description = isMl ? service.description_ml : service.description_en;
  const procedure = isMl ? service.procedure_ml : service.procedure_en;
  const processingTime = isMl ? service.processing_time_ml : service.processing_time_en;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-slate-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#01284b] to-[#0453cd] text-white p-4 flex items-start justify-between">
          <div className="min-w-0 pr-2">
            <span className="text-[11px] bg-white/20 text-blue-100 px-2 py-0.5 rounded-full font-medium">
              {isMl ? service.category_name_ml : service.category_name_en} • #{service.number}
            </span>
            <h3 className="text-lg font-bold mt-1 text-white leading-snug">
              {serviceName}
            </h3>
            {service.official_portal_url && (
              <a
                href={service.official_portal_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-blue-200 hover:text-white mt-1 transition-colors"
              >
                <span>{service.official_portal_name || 'Official Portal'}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-5 text-sm text-slate-700">
          {/* Description */}
          <p className="text-slate-600 leading-relaxed text-xs sm:text-sm">
            {description}
          </p>

          {/* Transparent Fee Schedule */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>{isMl ? 'സുതാര്യമായ ഫീസ് വിവരങ്ങൾ' : 'Transparent Fee Schedule'}</span>
            </h4>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                <span className="text-slate-500 block text-[11px]">{text.govtFee}</span>
                <span className="text-base font-extrabold text-slate-900">₹{service.govt_fee}</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">{isMl ? 'സർക്കാർ രസീത് സഹിതം' : 'With official treasury challan'}</span>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                <span className="text-slate-500 block text-[11px]">{text.nexaFee}</span>
                <span className="text-base font-extrabold text-[#0453cd]">₹{service.nexa_service_charge}</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">{isMl ? 'ഡെസ്ക് സർവീസ് നിരക്ക്' : 'Facilitation & system fee'}</span>
              </div>
            </div>
            {processingTime && (
              <div className="mt-2.5 flex items-center gap-1.5 text-xs text-slate-600">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span><strong>{isMl ? 'പ്രോസസ്സിംഗ് സമയം:' : 'Processing Time:'}</strong> {processingTime}</span>
              </div>
            )}
          </div>

          {/* Subservices List if available */}
          {service.subservices && service.subservices.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                {isMl ? 'ലഭ്യമായ അപേക്ഷകൾ' : 'Available Subservices'}
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {service.subservices.map(sub => (
                  <span
                    key={sub.id}
                    className="text-xs bg-blue-50 text-blue-800 border border-blue-200/60 px-2.5 py-1 rounded-md"
                  >
                    {isMl ? sub.name_ml : sub.name_en}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Document Checklist */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <FileCheck className="w-4 h-4 text-blue-600" />
              <span>{isMl ? 'ആവശ്യമായ രേഖകളുടെ ചെക്ക്‌ലിസ്റ്റ്' : 'Verified Document Checklist'}</span>
            </h4>
            <div className="space-y-2">
              {service.required_documents.map((doc, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2.5 p-2.5 bg-slate-50 border border-slate-200/80 rounded-lg text-xs"
                >
                  <CheckCircle className={`w-4 h-4 mt-0.5 flex-shrink-0 ${doc.mandatory ? 'text-emerald-600' : 'text-slate-400'}`} />
                  <div className="flex-1">
                    <span className="font-semibold text-slate-800">
                      {isMl ? doc.name_ml : doc.name_en}
                    </span>
                    {doc.mandatory && (
                      <span className="ml-2 text-[10px] bg-red-100 text-red-700 px-1.5 py-0.2 rounded font-medium">
                        {isMl ? 'നിർബന്ധം' : 'Mandatory'}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Step-by-Step Procedure */}
          {procedure && (
            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                {text.procedure}
              </h4>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs leading-relaxed whitespace-pre-line text-slate-700 font-mono">
                {procedure}
              </div>
            </div>
          )}

          {/* Statutory Disclaimer Alert */}
          <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-xl text-[11px] text-amber-900 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <span>
              {isMl
                ? 'സർക്കാർ നിയമങ്ങളും ഫീസുകളും ഔദ്യോഗിക വകുപ്പുകളുടെ തീരുമാനങ്ങൾക്ക് വിധേയമാണ്. അന്തിമ സർട്ടിഫിക്കറ്റ് അനുമതി സർക്കാർ ഓഫീസർമാർക്ക് മാത്രമാണ്. കൂടുതൽ സ്ഥിരീകരണത്തിന് ഞങ്ങളുടെ ഡെസ്കിൽ ബന്ധപ്പെടുക.'
                : 'Statutory government rules and fees are subject to updates by official authorities. Final certificate approval rests strictly with government officers. Verification is performed at desk.'}
            </span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 transition-colors cursor-pointer"
          >
            {text.close}
          </button>

          <button
            onClick={() => {
              onClose();
              onApply(service);
            }}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#01284b] to-[#0453cd] hover:from-[#0453cd] hover:to-[#01284b] text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{text.applyNow}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
