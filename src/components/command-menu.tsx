import { EntrySelector } from '@/components/entry-selector';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { VaultEntry } from '@/lib/typeshare';
import { formatFilenameDate, isToday } from '@/lib/utils';
import { useEntryNavigation } from '@/providers/entry-navigation-provider';
import { useVault } from '@/providers/vault-provider';
import { Calendar, ClipboardCopy, Home } from 'lucide-react';
import { useEffect, useState } from 'react';

export const CommandMenu = () => {
  const [open, setOpen] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);

  const { vault } = useVault();
  const { setCurrentEntry, goToToday } = useEntryNavigation();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);

    return () => document.removeEventListener('keydown', down);
  }, []);

  const handleEntrySelect = (entry: VaultEntry) => {
    setCurrentEntry(entry);
    setOpen(false);
  };

  const handleCalendarOpen = () => {
    setCalendarOpen(true);
    setOpen(false);
  };

  const handleGoToToday = () => {
    goToToday();
    setOpen(false);
  };

  return (
    <>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder='Search entries or commands...' />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>

          <CommandGroup heading='Navigation'>
            <CommandItem onSelect={handleGoToToday}>
              <Home className='h-4 w-4' />
              <span>Today</span>
            </CommandItem>
            <CommandItem onSelect={handleCalendarOpen}>
              <Calendar className='h-4 w-4' />
              <span>Open Calendar</span>
            </CommandItem>
          </CommandGroup>

          <CommandGroup heading='Recent'>
            {vault.entries
              .slice()
              .reverse()
              .slice(0, 5)
              .map((entry) => (
                <CommandItem
                  key={entry.filename}
                  onSelect={() => handleEntrySelect(entry)}
                  className={isToday(entry.filename) ? 'bg-accent/50' : ''}
                >
                  <Calendar className='h-4 w-4' />
                  <div className='flex flex-col'>
                    <span className='font-medium'>
                      {formatFilenameDate(entry.filename)}
                      {isToday(entry.filename) && ' (Today)'}
                    </span>
                  </div>
                </CommandItem>
              ))}
          </CommandGroup>

          <CommandGroup heading='Actions'>
            <CommandItem>
              <ClipboardCopy />
              <span>Copy current entry</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>

      <EntrySelector
        open={calendarOpen}
        onOpenChange={setCalendarOpen}
        onEntrySelect={handleEntrySelect}
      />
    </>
  );
};
