import { Toaster } from '@/components/ui/sonner';
import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App';
import './index.css';
import { EntryNavigationProvider } from './providers/entry-navigation-provider';
import { SettingsProvider } from './providers/settings-provider';
import { VaultProvider } from './providers/vault-provider';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <SettingsProvider>
      <VaultProvider>
        <EntryNavigationProvider>
          <App />
          <Toaster richColors />
        </EntryNavigationProvider>
      </VaultProvider>
    </SettingsProvider>
  </React.StrictMode>
);
