import React, { useState } from 'react';
import { Sparkles, Search, Layers, ChevronRight } from 'lucide-react';
import { Language, ServiceCategory } from '../types';

interface QuickChipsProps {
  language: Language;
  onSelectQuery: (query: string) => void;
  onSelectCategory: (categoryId: string) => void;
}

const POPULAR_QUERIES = {
  ml: [
    'പാസ്പോർട്ട് എടുക്കാൻ എന്തൊക്കെ വേണം?',
    'പുതിയ റേഷൻ കാർഡ് അപേക്ഷ',
    'പാൻ കാർഡ് തിരുത്തൽ',
    'വരുമാന സർട്ടിഫിക്കറ്റ്',
    'ഡ്രൈവിംഗ് ലൈസൻസ് പുതുക്കൽ',
    'കെ.എസ്.ഇ.ബി കറന്റ് ബിൽ',
    'പി.എസ്.സി തുളസി രജിസ്ട്രേഷൻ',
    'വാട്സാപ്പ് ഹെൽപ്പ് ഡെസ്ക്'
  ],
  en: [
    'How to apply for a fresh Passport?',
    'New Ration Card application',
    'PAN card correction procedure',
    'Income Certificate documents',
    'Driving Licence renewal slot',
    'KSEB Electricity bill payment',
    'Kerala PSC Thulasi registration',
    'Connect on WhatsApp'
  ]
};

const CATEGORIES: ServiceCategory[] = [
  { id: 'gov', name_en: 'Govt Services', name_ml: 'സർക്കാർ സേവനങ്ങൾ', icon: '🏛️' },
  { id: 'identity', name_en: 'Passport & PAN', name_ml: 'പാസ്പോർട്ട് & പാൻ', icon: '🆔' },
  { id: 'education', name_en: 'PSC & CAP', name_ml: 'പി.എസ്.സി & വിദ്യാഭ്യാസം', icon: '🎓' },
  { id: 'vehicle', name_en: 'RTO & Driving', name_ml: 'ആർ.ടി.ഒ & ലൈസൻസ്', icon: '🚗' },
  { id: 'business', name_en: 'GST & MSME', name_ml: 'ജി.എസ്.ടി & ബിസിനസ്സ്', icon: '💼' },
  { id: 'financial', name_en: 'Bills & Pension', name_ml: 'ബില്ലുകൾ & പെൻഷൻ', icon: '💳' },
  { id: 'travel', name_en: 'Pravasi & Travel', name_ml: 'പ്രവാസി & യാത്ര', icon: '✈️' }
];

export const QuickChips: React.FC<QuickChipsProps> = ({
  language,
  onSelectQuery,
  onSelectCategory
}) => {
  const [showAllCategories, setShowAllCategories] = useState(false);
  const queries = POPULAR_QUERIES[language];

  return (
    <div className="py-2.5 px-3 bg-slate-50 border-t border-slate-200 text-xs">
      {/* Category Pills Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-thin">
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat.id)}
            className="flex-shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-full bg-white border border-slate-200/90 hover:border-blue-400 hover:bg-blue-50/60 text-slate-700 hover:text-[#0453cd] font-medium transition-all shadow-2xs cursor-pointer"
          >
            <span>{cat.icon}</span>
            <span className="whitespace-nowrap">{language === 'ml' ? cat.name_ml : cat.name_en}</span>
          </button>
        ))}
      </div>

      {/* Suggested Questions Horizontal Scroller */}
      <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-thin pt-1">
        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1 flex-shrink-0 mr-1">
          <Sparkles className="w-3 h-3 text-amber-500" />
          <span>{language === 'ml' ? 'നിർദ്ദേശങ്ങൾ:' : 'Suggested:'}</span>
        </span>
        {queries.map((q, idx) => (
          <button
            key={idx}
            onClick={() => onSelectQuery(q)}
            className="flex-shrink-0 whitespace-nowrap text-xs bg-white border border-slate-200 hover:border-blue-400 hover:bg-blue-50 text-slate-700 hover:text-blue-700 px-3 py-1 rounded-full transition-all shadow-2xs cursor-pointer"
          >
            {q}
          </button>
        ))}
      </div>
    </div>
  );
};
