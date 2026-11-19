import React from 'react';
import { Bot, MessageCircle, Globe, Minus, X, RotateCcw } from 'lucide-react';
import { Language } from '../types';
import { UI_TEXT } from '../utils/language';
import { getDirectWhatsAppUrl } from '../utils/whatsapp';

interface ChatHeaderProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onClose: () => void;
  onMinimize: () => void;
  onClear: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  language,
  onLanguageChange,
  onClose,
  onMinimize,
  onClear
}) => {
  const text = UI_TEXT[language];

  return (
    <div className="bg-gradient-to-r from-[#01284b] via-[#0453cd] to-[#1e3e62] text-white px-4 py-3 rounded-t-2xl flex items-center justify-between shadow-md select-none">
      {/* Brand & Assistant Info */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="relative flex-shrink-0">
          <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-xs flex items-center justify-center border border-white/20 shadow-inner">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 border-2 border-[#01284b] rounded-full"></span>
        </div>

        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-extrabold text-base tracking-tight truncate leading-tight">
              {text.brandName}
            </h3>
            <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded-full font-medium text-emerald-200 uppercase tracking-wider">
              {text.online}
            </span>
          </div>
          <p className="text-[11px] text-white/80 truncate leading-tight">
            {text.subtitle}
          </p>
        </div>
      </div>

      {/* Action Controls */}
      <div className="flex items-center gap-1.5 flex-shrink-0">
        {/* Language Switch Toggle */}
        <button
          onClick={() => onLanguageChange(language === 'ml' ? 'en' : 'ml')}
          className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/15 hover:bg-white/25 text-xs font-semibold tracking-wide border border-white/20 transition-all cursor-pointer"
          title="Switch Language / ഭാഷ മാറ്റുക"
        >
          <Globe className="w-3.5 h-3.5 text-blue-200" />
          <span>{language === 'ml' ? 'ENG' : 'മല'}</span>
        </button>

        {/* WhatsApp Direct Link */}
        <a
          href={getDirectWhatsAppUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="w-8 h-8 rounded-full bg-emerald-600/80 hover:bg-emerald-600 flex items-center justify-center text-white transition-colors cursor-pointer"
          title="Connect on WhatsApp (+91 8086380373)"
        >
          <MessageCircle className="w-4 h-4" />
        </a>

        {/* Clear Chat */}
        <button
          onClick={onClear}
          className="w-8 h-8 rounded-full hover:bg-white/15 flex items-center justify-center text-white/80 hover:text-white transition-colors cursor-pointer"
          title={text.clearChat}
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>

        {/* Minimize */}
        <button
          onClick={onMinimize}
          className="w-8 h-8 rounded-full hover:bg-white/15 flex items-center justify-center text-white/80 hover:text-white transition-colors cursor-pointer"
          title="Minimize"
        >
          <Minus className="w-4 h-4" />
        </button>

        {/* Close */}
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-full hover:bg-red-500/80 flex items-center justify-center text-white/80 hover:text-white transition-colors cursor-pointer"
          title={text.close}
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
