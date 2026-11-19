import React, { useState, useEffect, useRef } from 'react';
import { Bot, Send, MessageCircle, Globe, RotateCcw, ArrowLeft, Shield, Sparkles, CheckCircle, ExternalLink } from 'lucide-react';
import { Message, Language, ServiceItem } from '../types';
import { MessageBubble } from '../components/MessageBubble';
import { QuickChips } from '../components/QuickChips';
import { DocumentCard } from '../components/DocumentCard';
import { EnquiryModal } from '../components/EnquiryModal';
import { UI_TEXT, WELCOME_MESSAGES } from '../utils/language';
import { sendMessageToAi, fetchServices } from '../utils/api';
import { getDirectWhatsAppUrl, BUSINESS_WHATSAPP_DISPLAY } from '../utils/whatsapp';

export const StandaloneChat: React.FC = () => {
  const [language, setLanguage] = useState<Language>(() => {
    return (localStorage.getItem('nexa_lang') as Language) || 'ml';
  });

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedServiceForDocs, setSelectedServiceForDocs] = useState<ServiceItem | null>(null);
  const [selectedServiceForEnquiry, setSelectedServiceForEnquiry] = useState<{ service: ServiceItem; subserviceName?: string } | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messages.length === 0) {
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setMessages([
        {
          id: 'welcome-1',
          sender: 'assistant',
          text: WELCOME_MESSAGES[language],
          timestamp: timeStr,
          language,
          suggestedReplies: language === 'ml'
            ? ['പാസ്പോർട്ട് സേവനങ്ങൾ', 'വില്ലേജ് സർട്ടിഫിക്കറ്റുകൾ', 'പാൻ കാർഡ്', 'ഡ്രൈവിംഗ് ലൈസൻസ്', 'റേഷൻ കാർഡ്']
            : ['Passport Services', 'Village Certificates', 'PAN Card Services', 'RTO / Driving Licence', 'Ration Card']
        }
      ]);
    }
  }, [language]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleLanguageChange = (newLang: Language) => {
    setLanguage(newLang);
    localStorage.setItem('nexa_lang', newLang);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text || isLoading) return;

    setInputValue('');
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: timeStr,
      language
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await sendMessageToAi({
        message: text,
        history: [...messages, userMessage],
        language
      });

      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        text: response.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        language: response.language,
        matchedService: response.matchedService,
        suggestedReplies: response.suggestedReplies,
        action: response.action
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err: any) {
      console.error('Chat error:', err);
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        sender: 'assistant',
        text: language === 'ml'
          ? 'ക്ഷമിക്കുക! നെറ്റ്‌വർക്ക് കണക്ഷനിൽ തടസ്സം നേരിട്ടു. ദയവായി അല്പം കഴിഞ്ഞ് വീണ്ടും ശ്രമിക്കുക.'
          : 'Sorry, we encountered a temporary network issue. Please retry.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isError: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const text = UI_TEXT[language];

  return (
    <div className="min-h-screen bg-[#F0F3FF] flex flex-col font-sans">
      {/* Top Header */}
      <header className="bg-gradient-to-r from-[#01284b] via-[#0453cd] to-[#1e3e62] text-white shadow-md">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a
              href="index.html"
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors flex items-center gap-1.5 text-xs font-semibold"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Nexa Services</span>
            </a>

            <div className="flex items-center gap-2 pl-2">
              <Bot className="w-6 h-6 text-white" />
              <div>
                <h1 className="font-extrabold text-sm sm:text-base tracking-tight leading-tight">
                  NEXA AI
                </h1>
                <span className="text-[10px] text-blue-200 block leading-none">
                  {text.subtitle}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            {/* Language Switch */}
            <button
              onClick={() => handleLanguageChange(language === 'ml' ? 'en' : 'ml')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/15 hover:bg-white/25 text-white font-semibold cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{language === 'ml' ? 'ENGLISH' : 'മലയാളം'}</span>
            </button>

            {/* WhatsApp */}
            <a
              href={getDirectWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#128C7E] hover:bg-[#075E54] text-white font-bold"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{BUSINESS_WHATSAPP_DISPLAY}</span>
            </a>
          </div>
        </div>
      </header>

      {/* Main Chat Workspace */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 flex flex-col">
        <div className="flex-1 bg-white rounded-2xl shadow-xl border border-slate-200/90 flex flex-col overflow-hidden">
          {/* Statutory Banner */}
          <div className="p-3 bg-blue-50 border-b border-blue-100 text-xs text-blue-900 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#0453cd]" />
              <span className="font-medium">{text.disclaimer}</span>
            </div>
            <span className="text-[11px] text-blue-700 hidden md:inline-block">
              {text.aadhaarNotice}
            </span>
          </div>

          {/* Conversation Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-3 bg-[#F9F9FF]">
            {messages.map(msg => (
              <MessageBubble
                key={msg.id}
                message={msg}
                language={language}
                onOpenDocuments={(s) => setSelectedServiceForDocs(s)}
                onOpenEnquiry={(s, sub) => setSelectedServiceForEnquiry({ service: s, subserviceName: sub })}
                onSelectQuickReply={(q) => handleSendMessage(q)}
              />
            ))}

            {isLoading && (
              <div className="flex items-center gap-2 text-slate-500 my-2 text-xs">
                <Bot className="w-4 h-4 animate-spin text-[#0453cd]" />
                <span>{language === 'ml' ? 'NEXA AI ചിന്തിക്കുന്നു...' : 'NEXA AI is thinking...'}</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Chips */}
          <QuickChips
            language={language}
            onSelectQuery={(q) => handleSendMessage(q)}
            onSelectCategory={() => {}}
          />

          {/* Input Bar */}
          <div className="p-4 bg-white border-t border-slate-200 flex items-center gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder={text.inputPlaceholder}
              disabled={isLoading}
              className="flex-1 bg-slate-100 hover:bg-slate-50 focus:bg-white text-slate-900 px-4 py-3 rounded-xl border border-slate-200 focus:border-[#0453cd] focus:outline-hidden text-sm transition-all"
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={!inputValue.trim() || isLoading}
              className="w-12 h-12 rounded-xl bg-[#0453cd] hover:bg-[#01284b] text-white flex items-center justify-center transition-all disabled:opacity-40 shadow-md cursor-pointer flex-shrink-0"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </main>

      {/* Modals */}
      {selectedServiceForDocs && (
        <DocumentCard
          service={selectedServiceForDocs}
          language={language}
          onClose={() => setSelectedServiceForDocs(null)}
          onApply={(s) => {
            setSelectedServiceForDocs(null);
            setSelectedServiceForEnquiry({ service: s });
          }}
        />
      )}

      {selectedServiceForEnquiry && (
        <EnquiryModal
          service={selectedServiceForEnquiry.service}
          subserviceName={selectedServiceForEnquiry.subserviceName}
          language={language}
          onClose={() => setSelectedServiceForEnquiry(null)}
          onSuccess={(refId) => {
            const isMl = language === 'ml';
            setMessages(prev => [
              ...prev,
              {
                id: `enquiry-success-${Date.now()}`,
                sender: 'assistant',
                text: isMl
                  ? `✅ **അപേക്ഷാ അന്വേഷണം വിജയകരമായി രജിസ്റ്റർ ചെയ്തു!**\n\nറഫറൻസ് നമ്പർ: **${refId}**\n\nഞങ്ങളുടെ കസ്റ്റമർ ഡെസ്ക് ഉടൻ നിങ്ങളുമായി ബന്ധപ്പെടുന്നതാണ്.`
                  : `✅ **Enquiry Registered Successfully!**\n\nReference: **${refId}**\n\nOur service desk will contact you shortly.`,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                language
              }
            ]);
          }}
        />
      )}
    </div>
  );
};
