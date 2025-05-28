import { Settings, Theme } from '@/lib/typeshare';
import { displayError } from '@/lib/utils';
import { invoke } from '@tauri-apps/api/tauri';
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

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
    throw new Error('useSettings must be used within a SettingsProvider');
  }

  return context;
};

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<Settings | undefined>(undefined);

  useEffect(() => {
    invoke<Settings>('read_settings')
      .then((settings) => {
        setSettings(settings);
      })
      .catch((error) => console.error(error));
  }, []);

  useEffect(() => {
    if (!settings) {
      return;
    }

    const root = window.document.documentElement;

    root.classList.remove('light', 'dark');

    if (settings.theme === Theme.System) {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
        .matches
        ? 'dark'
        : 'light';

      root.classList.add(systemTheme);

      return;
    }

    root.classList.add(settings.theme);
  }, [settings?.theme]);

  const updateSettings = (newSettings: Partial<Settings>) => {
    setSettings((prev) => {
      if (!prev) {
        return;
      }

      const settings = { ...prev, ...newSettings };

      invoke('write_settings', { settings }).catch((error) =>
        displayError(error)
      );

      return settings;
    });
  };

  if (!settings) {
    return null;
  }

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};
