import React from 'react';
import ReactDOM from 'react-dom/client';
import { StandaloneChat } from './pages/StandaloneChat';
import './index.css';

const rootEl = document.getElementById('root');
if (rootEl) {
  ReactDOM.createRoot(rootEl).render(
    <React.StrictMode>
      <StandaloneChat />
    </React.StrictMode>
  );
}
