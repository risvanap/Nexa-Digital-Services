import React, { useState } from 'react';
import { ChatLauncher } from '../components/ChatLauncher';
import { ChatWindow } from '../components/ChatWindow';
import { Language } from '../types';

export const WidgetApp: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [language, setLanguage] = useState<Language>(() => {
    return (localStorage.getItem('nexa_lang') as Language) || 'ml';
  });

  return (
    <div className="font-sans antialiased text-slate-900">
      <ChatLauncher
        isOpen={isOpen}
        onToggle={() => setIsOpen(!isOpen)}
        language={language}
      />

      <ChatWindow
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onMinimize={() => setIsOpen(false)}
      />
    </div>
  );
};
