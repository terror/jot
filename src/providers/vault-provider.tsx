import { Vault, VaultEntry } from '@/lib/typeshare';
import { displayError } from '@/lib/utils';
import { invoke } from '@tauri-apps/api/tauri';
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

import { useSettings } from './settings-provider';

type VaultContextType = {
  vault: Vault;
  updateEntry: (entry: VaultEntry) => void;
};

const VaultContext = createContext<VaultContextType | undefined>(undefined);

export const useVault = () => {
  const context = useContext(VaultContext);

  if (context === undefined) {
    throw new Error('useVault must be used within a VaultProvider');
  }

  return context;
};

export const VaultProvider = ({ children }: { children: ReactNode }) => {
  const { settings } = useSettings();

  const [vault, setVault] = useState<Vault | undefined>(undefined);

  useEffect(() => {
    invoke<Vault>('load_vault', { settings })
      .then((vault) => {
        setVault(vault);
      })
      .catch((error) => console.error(error));
  }, []);

  const updateEntry = (entry: VaultEntry) => {
    setVault((prev) => {
      if (!prev) {
        return prev;
      }

      const existingIndex = prev.entries.findIndex(
        (e) => e.filename === entry.filename
      );

      const updatedEntries = [...prev.entries];

      if (existingIndex >= 0) {
        updatedEntries[existingIndex] = entry;
      } else {
        updatedEntries.push(entry);
        updatedEntries.sort((a, b) => a.filename.localeCompare(b.filename));
      }

      invoke('write_vault_entry', { settings, entry }).catch((error) =>
        displayError(error)
      );

      return { ...prev, entries: updatedEntries };
    });
  };

  if (!vault) {
    return null;
  }

  return (
    <VaultContext.Provider value={{ vault, updateEntry }}>
      {children}
    </VaultContext.Provider>
  );
};
