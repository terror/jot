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
import { useEntryNavigation } from '@/providers/entry-navigation-provider';
import { Calendar, Home } from 'lucide-react';
import { useEffect, useState } from 'react';

export const CommandMenu = () => {
  const [open, setOpen] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);

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
        <CommandList className='py-1'>
          <CommandEmpty>No results found.</CommandEmpty>

          <CommandGroup heading='Actions'>
            <CommandItem onSelect={handleGoToToday}>
              <Home className='h-4 w-4' />
              <span>Today</span>
            </CommandItem>
            <CommandItem onSelect={handleCalendarOpen}>
              <Calendar className='h-4 w-4' />
              <span>Calendar</span>
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
