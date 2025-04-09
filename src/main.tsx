import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from '@/providers/theme-provider';
import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App';
import './index.css';
import { SettingsProvider } from './providers/settings-provider';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
      <SettingsProvider>
        <App />
        <Toaster richColors />
      </SettingsProvider>
    </ThemeProvider>
  </React.StrictMode>
);
