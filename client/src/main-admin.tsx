import React from 'react';
import ReactDOM from 'react-dom/client';
import { AdminApp } from './pages/AdminApp';
import './index.css';

const rootEl = document.getElementById('root');
if (rootEl) {
  ReactDOM.createRoot(rootEl).render(
    <React.StrictMode>
      <AdminApp />
    </React.StrictMode>
  );
}
