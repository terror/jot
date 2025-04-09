import { usePersistedState } from '@/hooks/use-persisted-state';
import { ReactNode, createContext, useContext } from 'react';

export interface Settings {
  directory?: string;
  font: string;
  fontSize: string;
}

const defaultSettings: Settings = {
  font: 'Inter',
  fontSize: '14',
};

type SettingsContextType = {
  settings: Settings;
  updateSettings: (settings: Partial<Settings>) => void;
};

const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined
);

export const useSettings = () => {
  const context = useContext(SettingsContext);

  if (context === undefined) {
    throw new Error('useSettings must be used within an SettingsProvider');
  }

  return context;
};

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = usePersistedState<Settings>(
    'editor-settings',
    defaultSettings
  );

  const updateSettings = (newSettings: Partial<Settings>) => {
    setSettings((prevSettings) => ({ ...prevSettings, ...newSettings }));
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};
