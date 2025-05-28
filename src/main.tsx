import { Toaster } from '@/components/ui/sonner';
import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App';
import './index.css';
import { SettingsProvider } from './providers/settings-provider';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <SettingsProvider>
      <App />
      <Toaster richColors />
    </SettingsProvider>
  </React.StrictMode>
);
