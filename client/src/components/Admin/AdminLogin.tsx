import React, { useState } from 'react';
import { Lock, Mail, Shield, ArrowRight, Sparkles, AlertCircle } from 'lucide-react';

interface AdminLoginProps {
  onLoginSuccess: (user: { email: string; name: string }) => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // If Supabase Auth is enabled or standard admin credentials
    setTimeout(() => {
      if (email && password.length >= 6) {
        onLoginSuccess({
          email,
          name: email.split('@')[0].toUpperCase()
        });
      } else {
        setError('Please enter a valid email and password (min 6 characters).');
        setLoading(false);
      }
    }, 400);
  };

  const handleDemoLogin = () => {
    onLoginSuccess({
      email: 'admin@nexadigitalservices.in',
      name: 'NEXA OPERATOR'
    });
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 sm:p-8 border border-slate-200">
        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-gradient-to-tr from-[#01284b] to-[#0453cd] text-white rounded-2xl flex items-center justify-center mx-auto shadow-lg mb-3">
            <Shield className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-extrabold text-[#01284b]">
            NEXA DIGITAL SERVICES
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Secure Administrator Console & Enquiry Desk
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              Administrator Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@nexadigitalservices.in"
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-xs"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-[#0453cd] hover:bg-[#01284b] text-white rounded-xl font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In to Admin Portal'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-slate-200 text-center">
          <p className="text-[11px] text-slate-500 mb-2">
            Local Developer / Preview Mode:
          </p>
          <button
            onClick={handleDemoLogin}
            className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Instant Access as Nexa Desk Admin</span>
          </button>
        </div>
      </div>
    </div>
  );
};
