import React from 'react';
import ReactDOM from 'react-dom/client';
import { WidgetApp } from './pages/WidgetApp';
import './index.css';

function initNexaChatbotWidget() {
  let mountPoint = document.getElementById('nexa-ai-chatbot');
  if (!mountPoint) {
    mountPoint = document.createElement('div');
    mountPoint.id = 'nexa-ai-chatbot';
    document.body.appendChild(mountPoint);
  }

  ReactDOM.createRoot(mountPoint).render(
    <React.StrictMode>
      <WidgetApp />
    </React.StrictMode>
  );
}

// Auto mount on document load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initNexaChatbotWidget);
} else {
  initNexaChatbotWidget();
}
