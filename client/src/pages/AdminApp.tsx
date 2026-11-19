import React, { useState } from 'react';
import { AdminLogin } from '../components/Admin/AdminLogin';
import { AdminLayout } from '../components/Admin/AdminLayout';

export const AdminApp: React.FC = () => {
  const [user, setUser] = useState<{ email: string; name: string } | null>(() => {
    const saved = localStorage.getItem('nexa_admin_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return null;
  });

  const handleLoginSuccess = (userData: { email: string; name: string }) => {
    setUser(userData);
    localStorage.setItem('nexa_admin_user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('nexa_admin_user');
  };

  if (!user) {
    return <AdminLogin onLoginSuccess={handleLoginSuccess} />;
  }

  return <AdminLayout user={user} onLogout={handleLogout} />;
};
