import React, { useState, useEffect } from 'react';
import { Search, Filter, MessageCircle, Edit3, CheckCircle2, Clock, X, Phone, User, ExternalLink } from 'lucide-react';
import { EnquiryRecord } from '../../types';
import { fetchEnquiries, updateEnquiryStatus } from '../../utils/api';
import { getEnquiryWhatsAppUrl } from '../../utils/whatsapp';

export const EnquiryManager: React.FC = () => {
  const [enquiries, setEnquiries] = useState<EnquiryRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const [activeEnquiry, setActiveEnquiry] = useState<EnquiryRecord | null>(null);
  const [editStatus, setEditStatus] = useState<string>('pending');
  const [editNotes, setEditNotes] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetchEnquiries({
        status: statusFilter,
        search,
        limit: 100
      });
      setEnquiries(res.data);
      setTotal(res.total);
    } catch (e) {
      console.error('Error fetching enquiries:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadData();
  };

  const openManageModal = (item: EnquiryRecord) => {
    setActiveEnquiry(item);
    setEditStatus(item.status);
    setEditNotes(item.internal_notes || '');
  };

  const handleSaveUpdates = async () => {
    if (!activeEnquiry) return;
    setIsSaving(true);
    try {
      const updated = await updateEnquiryStatus(activeEnquiry.id, {
        status: editStatus,
        internal_notes: editNotes
      });
      setEnquiries(prev => prev.map(e => e.id === updated.id ? updated : e));
      setActiveEnquiry(null);
    } catch (e) {
      console.error('Error updating enquiry:', e);
    } finally {
      setIsSaving(false);
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
            placeholder="Search by name, phone, or ref..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-xs"
          />
        </form>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs bg-white text-slate-700 font-medium cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <span className="text-xs text-slate-400 font-medium ml-2">
            Total: {total}
          </span>
        </div>
      </div>

      {/* Enquiries Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-xs text-slate-400">Loading customer requests...</div>
        ) : enquiries.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400">
            No customer enquiries match your search filter.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Reference & Date</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Service & Type</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {enquiries.map(item => (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-4 py-3 font-mono">
                      <span className="font-bold text-slate-900 block">{item.reference_id}</span>
                      <span className="text-[10px] text-slate-400">{new Date(item.created_at).toLocaleString()}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-bold text-slate-900 block">{item.customer_name}</span>
                      <span className="text-slate-500 font-mono">+91 {item.mobile_number}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-bold text-[#01284b] block">{item.service_name}</span>
                      <span className="text-slate-500 text-[11px]">{item.application_type || 'General'}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        item.status === 'completed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : item.status === 'in_progress'
                          ? 'bg-blue-100 text-blue-800'
                          : item.status === 'cancelled'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <a
                          href={getEnquiryWhatsAppUrl(item)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg transition-colors cursor-pointer"
                          title="Reply on WhatsApp"
                        >
                          <MessageCircle className="w-4 h-4" />
                        </a>
                        <button
                          onClick={() => openManageModal(item)}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold text-xs transition-colors cursor-pointer"
                        >
                          Details
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit / Manage Modal */}
      {activeEnquiry && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
            <div className="bg-[#01284b] text-white p-4 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-blue-200 uppercase font-mono">{activeEnquiry.reference_id}</span>
                <h3 className="font-bold text-base text-white">Enquiry Management</h3>
              </div>
              <button
                onClick={() => setActiveEnquiry(null)}
                className="w-7 h-7 rounded-full hover:bg-white/10 flex items-center justify-center text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs text-slate-700">
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Customer Name</span>
                  <span className="font-bold text-slate-900">{activeEnquiry.customer_name}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Mobile Number</span>
                  <span className="font-bold text-slate-900">+91 {activeEnquiry.mobile_number}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Selected Service</span>
                  <span className="font-bold text-[#0453cd]">{activeEnquiry.service_name}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Application Type</span>
                  <span className="font-bold text-slate-900">{activeEnquiry.application_type}</span>
                </div>
              </div>

              {activeEnquiry.short_description && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-900">
                  <span className="font-semibold block mb-0.5">Citizen Note / Description:</span>
                  <p>{activeEnquiry.short_description}</p>
                </div>
              )}

              {/* Status Updater */}
              <div>
                <label className="font-bold text-slate-800 block mb-1">Update Status</label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              {/* Internal Notes */}
              <div>
                <label className="font-bold text-slate-800 block mb-1">Internal Operator Notes</label>
                <textarea
                  rows={3}
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  placeholder="Record call updates, document collection notes, or application filing numbers..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              {/* Direct WhatsApp Callout */}
              <div className="pt-2 flex items-center gap-2">
                <a
                  href={getEnquiryWhatsAppUrl(activeEnquiry)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2.5 bg-[#128C7E] hover:bg-[#075E54] text-white rounded-xl font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Send WhatsApp Response</span>
                </a>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setActiveEnquiry(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveUpdates}
                disabled={isSaving}
                className="px-5 py-2 bg-[#0453cd] hover:bg-[#01284b] text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer disabled:opacity-50"
              >
                {isSaving ? 'Saving...' : 'Save Updates'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
