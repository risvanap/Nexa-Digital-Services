import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, RotateCcw, AlertCircle, Sparkles } from 'lucide-react';
import { Message, Language, ServiceItem } from '../types';
import { ChatHeader } from './ChatHeader';
import { MessageBubble } from './MessageBubble';
import { QuickChips } from './QuickChips';
import { DocumentCard } from './DocumentCard';
import { EnquiryModal } from './EnquiryModal';
import { UI_TEXT, WELCOME_MESSAGES } from '../utils/language';
import { sendMessageToAi, fetchServices } from '../utils/api';

interface ChatWindowProps {
  isOpen: boolean;
  onClose: () => void;
  onMinimize: () => void;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  isOpen,
  onClose,
  onMinimize
}) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('nexa_lang');
    return saved === 'en' ? 'en' : 'ml';
  });

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedServiceForDocs, setSelectedServiceForDocs] = useState<ServiceItem | null>(null);
  const [selectedServiceForEnquiry, setSelectedServiceForEnquiry] = useState<{ service: ServiceItem; subserviceName?: string } | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize welcome message when opened
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

  // Scroll to bottom whenever messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [isOpen]);

  const handleLanguageChange = (newLang: Language) => {
    setLanguage(newLang);
    localStorage.setItem('nexa_lang', newLang);

    // If chat only had welcome message, update it to the new language
    if (messages.length === 1 && messages[0].id === 'welcome-1') {
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setMessages([
        {
          id: 'welcome-1',
          sender: 'assistant',
          text: WELCOME_MESSAGES[newLang],
          timestamp: timeStr,
          language: newLang,
          suggestedReplies: newLang === 'ml'
            ? ['പാസ്പോർട്ട് സേവനങ്ങൾ', 'വില്ലേജ് സർട്ടിഫിക്കറ്റുകൾ', 'പാൻ കാർഡ്', 'ഡ്രൈവിംഗ് ലൈസൻസ്', 'റേഷൻ കാർഡ്']
            : ['Passport Services', 'Village Certificates', 'PAN Card Services', 'RTO / Driving Licence', 'Ration Card']
        }
      ]);
    }
  };

  const handleClearChat = () => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: 'assistant',
        text: WELCOME_MESSAGES[language],
        timestamp: timeStr,
        language,
        suggestedReplies: language === 'ml'
          ? ['പാസ്പോർട്ട് സേവനങ്ങൾ', 'വില്ലേജ് സർട്ടിഫിക്കറ്റുകൾ', 'പാൻ കാർഡ്', 'റേഷൻ കാർഡ്']
          : ['Passport Services', 'Village Certificates', 'PAN Card Services', 'Ration Card']
      }
    ]);
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
          ? 'ക്ഷമിക്കുക! നെറ്റ്‌വർക്ക് കണക്ഷനിൽ തടസ്സം നേരിട്ടു. ദയവായി അല്പം കഴിഞ്ഞ് വീണ്ടും ശ്രമിക്കുക അല്ലെങ്കിൽ ഞങ്ങളുടെ വാട്സാപ്പിൽ ബന്ധപ്പെടുക.'
          : 'Sorry, we encountered a temporary connection issue. Please retry or contact our WhatsApp desk at +91 8086380373.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isError: true,
        suggestedReplies: language === 'ml' ? ['വീണ്ടും ശ്രമിക്കുക', 'വാട്സാപ്പ് ഡെസ്ക്'] : ['Retry', 'WhatsApp Desk']
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategorySelect = async (categoryId: string) => {
    try {
      const { services } = await fetchServices({ category: categoryId });
      if (services.length > 0) {
        const isMl = language === 'ml';
        const serviceNames = services.slice(0, 6).map(s => isMl ? s.name_ml : s.name_en);
        const reply = isMl
          ? `**${services[0].category_name_ml}** വിഭാഗത്തിലെ പ്രധാന സേവനങ്ങൾ താഴെ നൽകുന്നു:\n\n${serviceNames.map((n, i) => `${i + 1}. ${n}`).join('\n')}\n\nഏത് സേവനത്തെക്കുറിച്ചാണ് അറിയേണ്ടത്?`
          : `Here are the popular services under **${services[0].category_name_en}**:\n\n${serviceNames.map((n, i) => `${i + 1}. ${n}`).join('\n')}\n\nWhich service would you like information about?`;

        setMessages(prev => [
          ...prev,
          {
            id: `cat-${Date.now()}`,
            sender: 'assistant',
            text: reply,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            language,
            suggestedReplies: serviceNames.slice(0, 4)
          }
        ]);
      }
    } catch (e) {
      console.error('Category fetch error:', e);
    }
  };

  if (!isOpen) return null;
  const text = UI_TEXT[language];

  return (
    <>
      {/* Main Responsive Floating Chat Window */}
      <div className="fixed bottom-0 right-0 sm:bottom-24 sm:right-6 z-50 w-full sm:w-[420px] md:w-[460px] h-[92vh] sm:h-[640px] max-h-[95vh] bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-200/90 animate-in slide-in-from-bottom-5 duration-300">
        {/* Header */}
        <ChatHeader
          language={language}
          onLanguageChange={handleLanguageChange}
          onClose={onClose}
          onMinimize={onMinimize}
          onClear={handleClearChat}
        />

        {/* Message Conversation Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-[#F9F9FF] select-text">
          {/* Statutory Disclaimer Pill Banner */}
          <div className="p-2.5 bg-blue-50/80 border border-blue-200/80 rounded-xl text-[11px] text-blue-900 leading-snug">
            <span className="font-semibold block mb-0.5">ℹ️ {text.disclaimer}</span>
            <span className="text-blue-700/90">{text.aadhaarNotice}</span>
          </div>

          {/* Messages */}
          {messages.map(msg => (
            <MessageBubble
              key={msg.id}
              message={msg}
              language={language}
              onOpenDocuments={(service) => setSelectedServiceForDocs(service)}
              onOpenEnquiry={(service, subName) => setSelectedServiceForEnquiry({ service, subserviceName: subName })}
              onSelectQuickReply={(reply) => handleSendMessage(reply)}
            />
          ))}

          {/* Typing Indicator */}
          {isLoading && (
            <div className="flex items-center gap-2 text-slate-500 my-2 text-xs">
              <div className="w-7 h-7 rounded-full bg-blue-100 text-[#0453cd] flex items-center justify-center">
                <Bot className="w-3.5 h-3.5 animate-pulse" />
              </div>
              <div className="bg-white border border-slate-200 px-3 py-2 rounded-2xl rounded-bl-xs shadow-2xs flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0453cd] animate-bounce"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#0453cd] animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#0453cd] animate-bounce [animation-delay:0.4s]"></span>
                <span className="ml-1 text-[11px] text-slate-400 font-medium">
                  {language === 'ml' ? 'NEXA AI ചിന്തിക്കുന്നു...' : 'NEXA AI is thinking...'}
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Service Suggestions Bar */}
        <QuickChips
          language={language}
          onSelectQuery={(q) => handleSendMessage(q)}
          onSelectCategory={handleCategorySelect}
        />

        {/* Message Input Bar */}
        <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
          <input
            ref={inputRef}
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
            className="flex-1 bg-slate-100/90 hover:bg-slate-100 focus:bg-white text-slate-900 placeholder:text-slate-400 text-xs sm:text-sm px-4 py-2.5 rounded-xl border border-transparent focus:border-[#0453cd] focus:outline-hidden transition-all"
          />

          <button
            onClick={() => handleSendMessage()}
            disabled={!inputValue.trim() || isLoading}
            aria-label="Send message"
            className="w-10 h-10 rounded-xl bg-[#0453cd] hover:bg-[#01284b] text-white flex items-center justify-center transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-md active:scale-95 cursor-pointer flex-shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Document Checklist Modal */}
      {selectedServiceForDocs && (
        <DocumentCard
          service={selectedServiceForDocs}
          language={language}
          onClose={() => setSelectedServiceForDocs(null)}
          onApply={(service) => {
            setSelectedServiceForDocs(null);
            setSelectedServiceForEnquiry({ service });
          }}
        />
      )}

      {/* Customer Enquiry Modal */}
      {selectedServiceForEnquiry && (
        <EnquiryModal
          service={selectedServiceForEnquiry.service}
          subserviceName={selectedServiceForEnquiry.subserviceName}
          language={language}
          onClose={() => setSelectedServiceForEnquiry(null)}
          onSuccess={(refId, whatsappUrl) => {
            const isMl = language === 'ml';
            setMessages(prev => [
              ...prev,
              {
                id: `enquiry-success-${Date.now()}`,
                sender: 'assistant',
                text: isMl
                  ? `✅ **അപേക്ഷാ അന്വേഷണം വിജയകരമായി രജിസ്റ്റർ ചെയ്തു!**\n\nനിങ്ങളുടെ റഫറൻസ് നമ്പർ: **${refId}**\n\nഞങ്ങളുടെ കസ്റ്റമർ ഡെസ്ക് ഉടൻ നിങ്ങളുമായി ബന്ധപ്പെടുന്നതാണ്. ആവശ്യമെങ്കിൽ [+91 8086380373](https://wa.me/918086380373) എന്ന നമ്പറിൽ വാട്സാപ്പിൽ ബന്ധപ്പെടാം.`
                  : `✅ **Customer Enquiry Registered Successfully!**\n\nReference ID: **${refId}**\n\nOur service desk will review your details and contact you shortly. You can also message directly on WhatsApp at [+91 8086380373](https://wa.me/918086380373).`,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                language
              }
            ]);
          }}
        />
      )}
    </>
  );
};
