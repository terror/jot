import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { ClipboardCopy } from 'lucide-react';
import { useEffect, useState } from 'react';

export const CommandMenu = () => {
  const [open, setOpen] = useState(false);

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

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder='Type a command or search...' />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading='Suggestions'>
          <CommandItem>
            <ClipboardCopy />
            <span>Copy text</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
};
