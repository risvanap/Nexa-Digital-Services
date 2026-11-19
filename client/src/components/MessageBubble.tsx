import React from 'react';
import { Bot, User, FileText, CheckCircle2, MessageCircle, ExternalLink, Send } from 'lucide-react';
import { Message, Language, ServiceItem } from '../types';
import { UI_TEXT } from '../utils/language';
import { getDirectWhatsAppUrl } from '../utils/whatsapp';

interface MessageBubbleProps {
  message: Message;
  language: Language;
  onOpenDocuments: (service: ServiceItem) => void;
  onOpenEnquiry: (service: ServiceItem, subserviceName?: string) => void;
  onSelectQuickReply: (text: string) => void;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  language,
  onOpenDocuments,
  onOpenEnquiry,
  onSelectQuickReply
}) => {
  const isUser = message.sender === 'user';
  const text = UI_TEXT[language];

  // Helper to render basic markdown-like formatting (bold, newlines, links)
  const renderFormattedText = (content: string) => {
    const lines = content.split('\n');
    return lines.map((line, idx) => {
      // Check for bullet lines
      const isBullet = line.trim().startsWith('•') || line.trim().startsWith('-');
      const cleanLine = isBullet ? line.replace(/^[•\-]\s*/, '') : line;

      // Replace bold **text**
      const parts = cleanLine.split(/(\*\*.*?\*\*)/g);

      const renderedParts = parts.map((part, pIdx) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={pIdx} className="font-semibold text-slate-900">{part.slice(2, -2)}</strong>;
        }
        return part;
      });

      if (isBullet) {
        return (
          <div key={idx} className="flex items-start gap-1.5 my-1 ml-1 text-slate-700">
            <span className="text-blue-500 font-bold">•</span>
            <span>{renderedParts}</span>
          </div>
        );
      }

      if (line.trim() === '') {
        return <div key={idx} className="h-2" />;
      }

      return <div key={idx} className="my-0.5">{renderedParts}</div>;
    });
  };

  return (
    <div className={`flex items-end gap-2 my-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {/* Bot Avatar */}
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#01284b] to-[#0453cd] flex items-center justify-center text-white flex-shrink-0 shadow-xs mb-1">
          <Bot className="w-4 h-4" />
        </div>
      )}

      {/* Bubble Container */}
      <div className={`max-w-[85%] sm:max-w-[78%] flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
        <div
          className={`px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-xs transition-all ${
            isUser
              ? 'bg-[#0453cd] text-white rounded-br-xs'
              : 'bg-white border border-slate-200/90 text-slate-800 rounded-bl-xs'
          }`}
        >
          {renderFormattedText(message.text)}

          {/* Interactive Service Card if Matched */}
          {message.matchedService && (
            <div className="mt-3 pt-3 border-t border-slate-200 bg-slate-50/80 -mx-2 px-3 py-2.5 rounded-xl">
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs font-bold text-[#01284b] truncate">
                  {language === 'ml' ? message.matchedService.name_ml : message.matchedService.name_en}
                </span>
                <span className="text-[10px] bg-blue-100 text-[#0453cd] px-2 py-0.5 rounded-full font-semibold">
                  #{message.matchedService.number}
                </span>
              </div>

              {/* Fee Breakdown Badges */}
              <div className="flex flex-wrap items-center gap-2 mb-3 text-[11px]">
                <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-md font-medium">
                  {text.govtFee}: ₹{message.matchedService.govt_fee}
                </span>
                <span className="bg-blue-50 text-blue-800 border border-blue-200 px-2 py-0.5 rounded-md font-medium">
                  {text.nexaFee}: ₹{message.matchedService.nexa_service_charge}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => onOpenDocuments(message.matchedService!)}
                  className="flex items-center justify-center gap-1.5 px-2.5 py-1.5 bg-white border border-slate-300 hover:border-blue-500 text-slate-700 hover:text-blue-600 rounded-lg text-xs font-medium transition-colors shadow-2xs cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5 text-blue-500" />
                  <span>{text.viewDocuments}</span>
                </button>

                <button
                  onClick={() => onOpenEnquiry(message.matchedService!)}
                  className="flex items-center justify-center gap-1.5 px-2.5 py-1.5 bg-[#0453cd] hover:bg-[#01284b] text-white rounded-lg text-xs font-semibold transition-colors shadow-2xs cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{text.applyNow}</span>
                </button>
              </div>

              {/* WhatsApp direct link */}
              <a
                href={getDirectWhatsAppUrl(`Hello Nexa, I need assistance with ${message.matchedService.name_en}`)}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 flex items-center justify-center gap-1.5 w-full py-1 text-[11px] text-emerald-700 hover:text-emerald-800 font-medium transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>{language === 'ml' ? 'വാട്സാപ്പിൽ നേരിട്ട് ചോദിക്കാം' : 'Ask directly on WhatsApp'}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}
        </div>

        {/* Timestamp */}
        <span className="text-[10px] text-slate-400 mt-1 px-1">
          {message.timestamp}
        </span>

        {/* Suggested Quick Replies */}
        {!isUser && message.suggestedReplies && message.suggestedReplies.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {message.suggestedReplies.map((reply, rIdx) => (
              <button
                key={rIdx}
                onClick={() => onSelectQuickReply(reply)}
                className="text-xs bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-400 text-slate-700 hover:text-blue-700 px-3 py-1 rounded-full transition-all duration-200 shadow-2xs cursor-pointer"
              >
                {reply}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* User Avatar */}
      {isUser && (
        <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 flex-shrink-0 shadow-xs mb-1">
          <User className="w-4 h-4" />
        </div>
      )}
    </div>
  );
};
