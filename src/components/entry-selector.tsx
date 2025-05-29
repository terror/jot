import { Calendar } from '@/components/ui/calendar';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { VaultEntry } from '@/lib/typeshare';
import { getDateFilename, parseFilenameToDate } from '@/lib/utils';
import { useVault } from '@/providers/vault-provider';
import { useMemo } from 'react';

interface EntrySelectorProps {
  onEntrySelect: (entry: VaultEntry) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const EntrySelector = ({
  onEntrySelect,
  open,
  onOpenChange,
}: EntrySelectorProps) => {
  const { vault } = useVault();

  const entryDates = useMemo(() => {
    const dates = new Set<string>();

    vault.entries.forEach((entry) => {
      const date = parseFilenameToDate(entry.filename);
      dates.add(date.toDateString());
    });

    return dates;
  }, [vault.entries]);

  const getEntryForDate = (date: Date): VaultEntry | null => {
    const filename = getDateFilename(date);

    return vault.entries.find((entry) => entry.filename === filename) || null;
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;

    const entry = getEntryForDate(date);

    if (entry) {
      onEntrySelect(entry);
      onOpenChange(false);
    }
  };

  const isDateDisabled = (date: Date): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (date > today) return true;
    return !entryDates.has(date.toDateString());
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='w-80 max-w-none [&>button]:hidden'>
        <div className='flex flex-col items-center space-y-4'>
          <Calendar
            mode='single'
            onSelect={handleDateSelect}
            disabled={isDateDisabled}
            className='rounded-md'
            initialFocus
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
