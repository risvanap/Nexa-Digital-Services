import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, HelpCircle, X, CheckCircle2 } from 'lucide-react';
import { FAQItem } from '../../types';
import { fetchFaqs, createFaq, deleteFaq } from '../../utils/api';

export const FAQManager: React.FC = () => {
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [isAdding, setIsAdding] = useState(false);
  const [newQuestionEn, setNewQuestionEn] = useState('');
  const [newQuestionMl, setNewQuestionMl] = useState('');
  const [newAnswerEn, setNewAnswerEn] = useState('');
  const [newAnswerMl, setNewAnswerMl] = useState('');
  const [newServiceId, setNewServiceId] = useState('general');

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchFaqs();
      setFaqs(data);
    } catch (e) {
      console.error('Failed to load FAQs:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateFaq = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestionEn.trim() || !newAnswerEn.trim()) return;

    try {
      const created = await createFaq({
        question_en: newQuestionEn.trim(),
        question_ml: newQuestionMl.trim() || newQuestionEn.trim(),
        answer_en: newAnswerEn.trim(),
        answer_ml: newAnswerMl.trim() || newAnswerEn.trim(),
        service_id: newServiceId
      });
      setFaqs(prev => [...prev, created]);
      setIsAdding(false);
      setNewQuestionEn('');
      setNewQuestionMl('');
      setNewAnswerEn('');
      setNewAnswerMl('');
    } catch (err) {
      console.error('Error creating FAQ:', err);
    }
  };

  const handleDeleteFaq = async (id: string) => {
    if (!confirm('Are you sure you want to delete this FAQ entry from the AI Knowledge Base?')) return;
    try {
      await deleteFaq(id);
      setFaqs(prev => prev.filter(f => f.id !== id));
    } catch (err) {
      console.error('Error deleting FAQ:', err);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header with Add Button */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div>
          <h3 className="font-bold text-slate-900 text-sm">AI Knowledge Base & FAQs</h3>
          <p className="text-xs text-slate-500">
            Pre-trained Malayalam and English answers used by NEXA AI to answer customer questions accurately.
          </p>
        </div>

        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#0453cd] hover:bg-[#01284b] text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Knowledge Item</span>
        </button>
      </div>

      {/* FAQs List */}
      <div className="space-y-3">
        {loading ? (
          <div className="p-8 text-center text-xs text-slate-400">Loading FAQs...</div>
        ) : faqs.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400">No FAQs found.</div>
        ) : (
          faqs.map(faq => (
            <div
              key={faq.id}
              className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] bg-blue-100 text-[#0453cd] px-2 py-0.5 rounded-full font-bold uppercase">
                      {faq.service_id}
                    </span>
                    <h4 className="font-bold text-slate-900 text-xs sm:text-sm">
                      🇬🇧 {faq.question_en}
                    </h4>
                  </div>
                  <h4 className="font-bold text-[#01284b] text-xs sm:text-sm">
                    🇮🇳 {faq.question_ml}
                  </h4>
                </div>

                <button
                  onClick={() => handleDeleteFaq(faq.id)}
                  className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                  title="Delete FAQ"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div>
                  <span className="font-semibold text-slate-500 text-[10px] uppercase block mb-1">
                    English Answer
                  </span>
                  <p className="text-slate-700 leading-relaxed">{faq.answer_en}</p>
                </div>
                <div>
                  <span className="font-semibold text-slate-500 text-[10px] uppercase block mb-1">
                    Malayalam Answer (മലയാളം)
                  </span>
                  <p className="text-slate-700 leading-relaxed">{faq.answer_ml}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add FAQ Modal */}
      {isAdding && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
            <div className="bg-[#01284b] text-white p-4 flex items-center justify-between">
              <h3 className="font-bold text-base text-white">Add Knowledge Base Item</h3>
              <button
                onClick={() => setIsAdding(false)}
                className="w-7 h-7 rounded-full hover:bg-white/10 flex items-center justify-center text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateFaq} className="p-5 space-y-3.5 text-xs text-slate-700">
              <div>
                <label className="font-bold text-slate-800 block mb-1">Category / Service Tag</label>
                <input
                  type="text"
                  value={newServiceId}
                  onChange={(e) => setNewServiceId(e.target.value)}
                  placeholder="e.g. passport, ration-card, general, fees"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">Question (English) *</label>
                <input
                  type="text"
                  required
                  value={newQuestionEn}
                  onChange={(e) => setNewQuestionEn(e.target.value)}
                  placeholder="e.g. How long does passport verification take?"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">Question (Malayalam)</label>
                <input
                  type="text"
                  value={newQuestionMl}
                  onChange={(e) => setNewQuestionMl(e.target.value)}
                  placeholder="ഉദാ: പാസ്പോർട്ട് വെരിഫിക്കേഷന് എത്ര സമയമെടുക്കും?"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">Answer (English) *</label>
                <textarea
                  rows={3}
                  required
                  value={newAnswerEn}
                  onChange={(e) => setNewAnswerEn(e.target.value)}
                  placeholder="Enter clear, accurate English explanation..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 resize-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">Answer (Malayalam)</label>
                <textarea
                  rows={3}
                  value={newAnswerMl}
                  onChange={(e) => setNewAnswerMl(e.target.value)}
                  placeholder="മലയാളത്തിലുള്ള കൃത്യമായ വിവരണം നൽകുക..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0453cd] hover:bg-[#01284b] text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer"
                >
                  Add Knowledge Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
