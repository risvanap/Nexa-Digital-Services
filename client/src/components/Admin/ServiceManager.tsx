import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2, CheckCircle2, AlertCircle, X, Shield, ExternalLink } from 'lucide-react';
import { ServiceItem } from '../../types';
import { fetchServices } from '../../utils/api';

export const ServiceManager: React.FC = () => {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const [activeEditService, setActiveEditService] = useState<ServiceItem | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetchServices({
        category: selectedCategory !== 'all' ? selectedCategory : undefined,
        search
      });
      setServices(res.services);
      setCategories(res.categories);
    } catch (e) {
      console.error('Failed to load services:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedCategory]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadData();
  };

  const openEditModal = (service: ServiceItem) => {
    setActiveEditService({ ...service });
    setIsEditing(true);
  };

  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeEditService) return;

    // Send PUT request to update service
    try {
      const res = await fetch(`/api/services/${activeEditService.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(activeEditService)
      });
      const json = await res.json();
      if (json.success) {
        setServices(prev => prev.map(s => s.id === activeEditService.id ? activeEditService : s));
        setIsEditing(false);
        setActiveEditService(null);
      }
    } catch (err) {
      console.error('Error saving service:', err);
    }
  };

  return (
    <div className="space-y-4">
      {/* Search and Filters Header */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search all 43 services..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-xs"
          />
        </form>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs bg-white text-slate-700 font-medium cursor-pointer"
          >
            <option value="all">All 7 Categories</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>
                {cat.name_en} ({cat.name_ml})
              </option>
            ))}
          </select>
          <span className="text-xs text-slate-400 font-medium ml-2">
            Services: {services.length}
          </span>
        </div>
      </div>

      {/* Services Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-xs text-slate-400">Loading catalog...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">#</th>
                  <th className="px-4 py-3">Service Name</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Govt Fee</th>
                  <th className="px-4 py-3">Nexa Charge</th>
                  <th className="px-4 py-3">Official Portal</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {services.map(s => (
                  <tr key={s.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-4 py-3 font-bold text-slate-400 font-mono">
                      {s.number}
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-bold text-slate-900 block">{s.name_en}</span>
                      <span className="text-slate-500 text-[11px]">{s.name_ml}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium text-[11px]">
                        {s.category_name_en}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-semibold text-slate-800">
                      ₹{s.govt_fee}
                    </td>
                    <td className="px-4 py-3 font-bold text-[#0453cd]">
                      ₹{s.nexa_service_charge}
                    </td>
                    <td className="px-4 py-3">
                      {s.official_portal_url ? (
                        <a
                          href={s.official_portal_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline flex items-center gap-1 text-[11px]"
                        >
                          <span className="truncate max-w-[120px]">{s.official_portal_name || 'Portal'}</span>
                          <ExternalLink className="w-3 h-3 flex-shrink-0" />
                        </a>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => openEditModal(s)}
                        className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg font-semibold text-xs transition-colors cursor-pointer"
                      >
                        Edit Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit Service Modal */}
      {isEditing && activeEditService && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden border border-slate-200 max-h-[90vh] flex flex-col">
            <div className="bg-[#01284b] text-white p-4 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-blue-200 uppercase font-mono">Service #{activeEditService.number}</span>
                <h3 className="font-bold text-base text-white">Edit Service Information</h3>
              </div>
              <button
                onClick={() => setIsEditing(false)}
                className="w-7 h-7 rounded-full hover:bg-white/10 flex items-center justify-center text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveService} className="p-5 overflow-y-auto space-y-3.5 text-xs text-slate-700">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-800 block mb-1">Name (English)</label>
                  <input
                    type="text"
                    required
                    value={activeEditService.name_en}
                    onChange={(e) => setActiveEditService({ ...activeEditService, name_en: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-800 block mb-1">Name (Malayalam)</label>
                  <input
                    type="text"
                    required
                    value={activeEditService.name_ml}
                    onChange={(e) => setActiveEditService({ ...activeEditService, name_ml: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">Description (English)</label>
                <textarea
                  rows={2}
                  value={activeEditService.description_en}
                  onChange={(e) => setActiveEditService({ ...activeEditService, description_en: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 resize-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">Description (Malayalam)</label>
                <textarea
                  rows={2}
                  value={activeEditService.description_ml}
                  onChange={(e) => setActiveEditService({ ...activeEditService, description_ml: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-800 block mb-1">Govt Statutory Fee (₹)</label>
                  <input
                    type="number"
                    value={activeEditService.govt_fee}
                    onChange={(e) => setActiveEditService({ ...activeEditService, govt_fee: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-800 block mb-1">Nexa Service Charge (₹)</label>
                  <input
                    type="number"
                    value={activeEditService.nexa_service_charge}
                    onChange={(e) => setActiveEditService({ ...activeEditService, nexa_service_charge: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-800 block mb-1">Official Portal Name</label>
                  <input
                    type="text"
                    value={activeEditService.official_portal_name || ''}
                    onChange={(e) => setActiveEditService({ ...activeEditService, official_portal_name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-800 block mb-1">Official Portal URL</label>
                  <input
                    type="url"
                    value={activeEditService.official_portal_url || ''}
                    onChange={(e) => setActiveEditService({ ...activeEditService, official_portal_url: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <span className="font-bold text-slate-800 block mb-1">Document Requirements</span>
                <span className="text-[11px] text-slate-500 block mb-2">
                  Total {activeEditService.required_documents.length} verified documents on checklist.
                </span>
                <div className="space-y-1">
                  {activeEditService.required_documents.map((doc, idx) => (
                    <div key={idx} className="text-[11px] text-slate-700 flex items-center justify-between bg-white p-1.5 rounded border border-slate-200">
                      <span>{doc.name_en} / {doc.name_ml}</span>
                      <span className="font-bold text-blue-600">{doc.mandatory ? 'Mandatory' : 'Optional'}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0453cd] hover:bg-[#01284b] text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
