import React from 'react';
import { Bot, X, Sparkles } from 'lucide-react';

interface ChatLauncherProps {
  isOpen: boolean;
  onToggle: () => void;
  language: 'ml' | 'en';
}

export const ChatLauncher: React.FC<ChatLauncherProps> = ({ isOpen, onToggle, language }) => {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
      {/* Floating Prompt Pill (Only visible when closed) */}
      {!isOpen && (
        <button
          onClick={onToggle}
          className="hidden sm:flex items-center gap-2.5 bg-white text-slate-800 px-4 py-2.5 rounded-full shadow-xl border border-slate-200/80 hover:shadow-2xl hover:border-blue-400 transition-all duration-300 group cursor-pointer"
        >
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="text-xs font-semibold text-[#01284b] group-hover:text-[#0453cd] transition-colors">
            {language === 'ml' ? 'NEXA AI സഹായം' : 'Chat with NEXA AI'}
          </span>
          <Sparkles className="w-3.5 h-3.5 text-amber-500 group-hover:rotate-12 transition-transform" />
        </button>
      )}

      {/* Main Circular Floating Launcher */}
      <button
        onClick={onToggle}
        aria-label={isOpen ? 'Close Chatbot' : 'Open NEXA AI Assistant'}
        className={`w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center text-white shadow-2xl transition-all duration-300 transform active:scale-95 cursor-pointer relative ${
          isOpen
            ? 'bg-slate-700 hover:bg-slate-800 rotate-90'
            : 'bg-gradient-to-tr from-[#01284b] via-[#0453cd] to-[#1e3e62] hover:scale-105 hover:shadow-[0_10px_30px_rgba(4,83,205,0.4)]'
        }`}
      >
        {isOpen ? (
          <X className="w-6 h-6 md:w-7 md:h-7" />
        ) : (
          <>
            <Bot className="w-7 h-7 md:w-8 md:h-8" />
            {/* Online Green Indicator Dot */}
            <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-emerald-400 border-2 border-white rounded-full"></span>
          </>
        )}
      </button>
    </div>
  );
};
