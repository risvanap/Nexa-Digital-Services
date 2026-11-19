import React from 'react';
import { Users, Clock, CheckCircle2, AlertCircle, FileCheck, PhoneCall, MessageCircle, ExternalLink } from 'lucide-react';
import { DashboardStats as StatsType, EnquiryRecord } from '../../types';
import { getEnquiryWhatsAppUrl } from '../../utils/whatsapp';

interface DashboardStatsProps {
  stats: StatsType | null;
  onViewEnquiry: (enquiry: EnquiryRecord) => void;
  onNavigateToEnquiries: () => void;
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({
  stats,
  onViewEnquiry,
  onNavigateToEnquiries
}) => {
  if (!stats) return <div className="p-8 text-center text-slate-500">Loading analytics...</div>;

  return (
    <div className="space-y-6">
      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-medium text-slate-500 block">Total Enquiries</span>
            <span className="text-2xl font-black text-slate-900">{stats.total}</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-medium text-slate-500 block">Today's Inquiries</span>
            <span className="text-2xl font-black text-amber-600">{stats.today}</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center flex-shrink-0">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-medium text-slate-500 block">Pending Inquiries</span>
            <span className="text-2xl font-black text-red-600">{stats.pending}</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-medium text-slate-500 block">Completed</span>
            <span className="text-2xl font-black text-emerald-600">{stats.completed}</span>
          </div>
        </div>
      </div>

      {/* Services summary bar */}
      <div className="bg-gradient-to-r from-[#01284b] to-[#0453cd] text-white p-5 rounded-2xl shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FileCheck className="w-8 h-8 text-blue-200" />
          <div>
            <h4 className="font-bold text-base">Full Digital Services Knowledge Base Active</h4>
            <p className="text-xs text-white/80">
              Covering all 43 verified citizen service categories with Malayalam & English document checklists.
            </p>
          </div>
        </div>
        <span className="bg-white/20 text-white font-extrabold text-sm px-3.5 py-1.5 rounded-xl">
          {stats.total_services} Active Services
        </span>
      </div>

      {/* Recent Customer Requests Feed */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-sm">
            Recent Customer Requests
          </h3>
          <button
            onClick={onNavigateToEnquiries}
            className="text-xs font-semibold text-[#0453cd] hover:underline cursor-pointer"
          >
            View All ({stats.total})
          </button>
        </div>

        {stats.recent && stats.recent.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {stats.recent.map(enquiry => (
              <div
                key={enquiry.id}
                className="p-4 hover:bg-slate-50/80 transition-colors flex items-center justify-between gap-4"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-slate-900 truncate">
                      {enquiry.customer_name}
                    </span>
                    <span className="text-[10px] font-mono bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                      {enquiry.reference_id}
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                      enquiry.status === 'completed'
                        ? 'bg-emerald-100 text-emerald-800'
                        : enquiry.status === 'in_progress'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {enquiry.status}
                    </span>
                  </div>

                  <div className="text-xs text-slate-500 mt-1 flex items-center gap-3">
                    <span><strong>Service:</strong> {enquiry.service_name}</span>
                    <span>•</span>
                    <span><strong>Mobile:</strong> +91 {enquiry.mobile_number}</span>
                    <span>•</span>
                    <span>{new Date(enquiry.created_at).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <a
                    href={getEnquiryWhatsAppUrl(enquiry)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition-colors"
                    title="Reply on WhatsApp"
                  >
                    <MessageCircle className="w-4 h-4" />
                  </a>

                  <button
                    onClick={() => onViewEnquiry(enquiry)}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Manage
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-xs text-slate-400">
            No customer enquiries recorded yet. Submissions from the website or chatbot will appear here in real-time.
          </div>
        )}
      </div>
    </div>
  );
};
