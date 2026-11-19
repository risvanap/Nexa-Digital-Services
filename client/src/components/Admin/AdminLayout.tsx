import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Inbox,
  Layers,
  HelpCircle,
  Settings,
  LogOut,
  Shield,
  ExternalLink,
  MessageCircle,
  FileCheck,
  CheckCircle2
} from 'lucide-react';
import { DashboardStats as StatsType, EnquiryRecord } from '../../types';
import { DashboardStats } from './DashboardStats';
import { EnquiryManager } from './EnquiryManager';
import { ServiceManager } from './ServiceManager';
import { FAQManager } from './FAQManager';
import { fetchDashboardStats } from '../../utils/api';
import { BUSINESS_WHATSAPP_DISPLAY } from '../../utils/whatsapp';

interface AdminLayoutProps {
  user: { email: string; name: string };
  onLogout: () => void;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'enquiries' | 'services' | 'faqs' | 'settings'>('dashboard');
  const [stats, setStats] = useState<StatsType | null>(null);

  const loadStats = async () => {
    try {
      const data = await fetchDashboardStats();
      setStats(data);
    } catch (e) {
      console.error('Failed to load stats:', e);
    }
  };

  useEffect(() => {
    loadStats();
    const interval = setInterval(loadStats, 15000); // 15s refresh
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#F0F3FF] flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-[#01284b] text-white flex-shrink-0 flex flex-col justify-between">
        <div>
          {/* Logo & Brand */}
          <div className="p-5 border-b border-white/10 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-md">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-extrabold text-sm tracking-tight text-white leading-tight">
                NEXA DIGITAL
              </h1>
              <span className="text-[10px] text-blue-200/90 font-medium block">
                Citizen Support Admin
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1 text-xs">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-semibold transition-all cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'bg-[#0453cd] text-white shadow-sm'
                  : 'text-white/70 hover:bg-white/10 hover:text-white'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard Overview</span>
            </button>

            <button
              onClick={() => setActiveTab('enquiries')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-semibold transition-all cursor-pointer ${
                activeTab === 'enquiries'
                  ? 'bg-[#0453cd] text-white shadow-sm'
                  : 'text-white/70 hover:bg-white/10 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Inbox className="w-4 h-4" />
                <span>Customer Enquiries</span>
              </div>
              {stats && stats.pending > 0 && (
                <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {stats.pending}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('services')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-semibold transition-all cursor-pointer ${
                activeTab === 'services'
                  ? 'bg-[#0453cd] text-white shadow-sm'
                  : 'text-white/70 hover:bg-white/10 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Layers className="w-4 h-4" />
                <span>Services (43)</span>
              </div>
              <span className="bg-white/10 text-blue-200 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                43
              </span>
            </button>

            <button
              onClick={() => setActiveTab('faqs')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-semibold transition-all cursor-pointer ${
                activeTab === 'faqs'
                  ? 'bg-[#0453cd] text-white shadow-sm'
                  : 'text-white/70 hover:bg-white/10 hover:text-white'
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              <span>AI Knowledge & FAQs</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-semibold transition-all cursor-pointer ${
                activeTab === 'settings'
                  ? 'bg-[#0453cd] text-white shadow-sm'
                  : 'text-white/70 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>System Settings</span>
            </button>
          </nav>
        </div>

        {/* User Info & Quick Links */}
        <div className="p-4 border-t border-white/10 text-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="min-w-0">
              <span className="text-[10px] text-white/50 block font-medium">SIGNED IN AS</span>
              <span className="font-bold text-white text-xs truncate block">{user.email}</span>
            </div>
            <button
              onClick={onLogout}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-red-500/80 text-white transition-colors cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          <a
            href="index.html"
            className="flex items-center justify-center gap-1.5 w-full py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-[11px] font-semibold transition-colors"
          >
            <span>View Public Website</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </aside>

      {/* Main Content Pane */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        {/* Top Header Bar */}
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-base font-extrabold text-[#01284b] uppercase tracking-wide">
              {activeTab === 'dashboard' && 'Dashboard Overview'}
              {activeTab === 'enquiries' && 'Customer Enquiries & Applications'}
              {activeTab === 'services' && 'All 43 Citizen Services'}
              {activeTab === 'faqs' && 'AI Knowledge Base Management'}
              {activeTab === 'settings' && 'System Configuration'}
            </h2>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <span className="hidden sm:inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>WhatsApp Desk: {BUSINESS_WHATSAPP_DISPLAY}</span>
            </span>
          </div>
        </header>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'dashboard' && (
            <DashboardStats
              stats={stats}
              onViewEnquiry={() => setActiveTab('enquiries')}
              onNavigateToEnquiries={() => setActiveTab('enquiries')}
            />
          )}

          {activeTab === 'enquiries' && <EnquiryManager />}

          {activeTab === 'services' && <ServiceManager />}

          {activeTab === 'faqs' && <FAQManager />}

          {activeTab === 'settings' && (
            <div className="max-w-2xl bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4 text-xs text-slate-700">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-200 pb-2">
                System & AI Assistant Settings
              </h3>

              <div className="space-y-3">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                  <span className="font-bold text-slate-800 block">AI Integration Model</span>
                  <p className="text-slate-500 text-[11px]">
                    NEXA AI connects to the OpenAI API (model: gpt-4o-mini) when <code>OPENAI_API_KEY</code> is set in environment variables. If no key is set or upon API timeout, it seamlessly runs on its built-in rule-based Kerala conversational NLP engine.
                  </p>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                  <span className="font-bold text-slate-800 block">Database Storage</span>
                  <p className="text-slate-500 text-[11px]">
                    Configured for Supabase PostgreSQL with complete Row Level Security (RLS) tables (<code>services</code>, <code>service_documents</code>, <code>customer_enquiries</code>, <code>service_faqs</code>). Includes an in-memory & file-backed fallback store.
                  </p>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                  <span className="font-bold text-slate-800 block">Statutory Non-Affiliation Guardrails</span>
                  <p className="text-slate-500 text-[11px]">
                    Nexa Digital Services is strictly represented as an independent citizen facilitation kiosk. Aadhaar enrolments/biometric updates are automatically blocked and directed to official UIDAI bank/post-office desks.
                  </p>
                </div>

                <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-900">
                  <span className="font-bold block mb-0.5">Need to update official keys?</span>
                  <p className="text-[11px]">
                    Edit <code>.env</code> in your root directory and restart the Node server.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
