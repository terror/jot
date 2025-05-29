import { VaultEntry } from '@/lib/typeshare';
import { getTodayFilename } from '@/lib/utils';
import { ReactNode, createContext, useContext, useState } from 'react';

type EntryNavigationContextType = {
  currentEntry: VaultEntry | null;
  setCurrentEntry: (entry: VaultEntry) => void;
  getTodayEntry: () => VaultEntry;
  goToToday: () => void;
};

const EntryNavigationContext = createContext<
  EntryNavigationContextType | undefined
>(undefined);

export const useEntryNavigation = () => {
  const context = useContext(EntryNavigationContext);

  if (context === undefined) {
    throw new Error(
      'useEntryNavigation must be used within an EntryNavigationProvider'
    );
  }

  return context;
};

export const EntryNavigationProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [currentEntry, setCurrentEntry] = useState<VaultEntry | null>(null);

  const getTodayEntry = (): VaultEntry => {
    return {
      filename: getTodayFilename(),
      content: '',
    };
  };

  const goToToday = () => {
    setCurrentEntry(getTodayEntry());
  };

  return (
    <EntryNavigationContext.Provider
      value={{
        currentEntry,
        setCurrentEntry,
        getTodayEntry,
        goToToday,
      }}
    >
      {children}
    </EntryNavigationContext.Provider>
  );
};
