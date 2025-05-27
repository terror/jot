import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { displayError, getLastPathSegment } from '@/lib/utils';
import { useSettings } from '@/providers/settings-provider';
import { useTheme } from '@/providers/theme-provider';
import { open } from '@tauri-apps/api/dialog';
import { Folder, Moon, Settings, Sun } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export const SettingsDialog = () => {
  const { theme, setTheme } = useTheme();
  const { settings, updateSettings } = useSettings();

  const [isOpen, setIsOpen] = useState(false);

  const [fonts] = useState([
    'Arial',
    'Calibri',
    'Cambria',
    'Comic Sans MS',
    'Courier New',
    'Georgia',
    'Helvetica',
    'Inter',
    'JetBrains Mono',
    'Menlo',
    'Monaco',
    'Roboto',
    'Segoe UI',
    'Times New Roman',
    'Verdana',
  ]);

  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');

  const chooseDirectory = async () => {
    try {
      const selected = await open({
        directory: true,
        multiple: false,
      });

      if (selected === null) {
        throw new Error('No directory selected');
      }

      const directory = Array.isArray(selected) ? selected[0] : selected;

      updateSettings({ directory });

      toast.success(`Successfully selected ${directory} as your save location`);
    } catch (error) {
      displayError(error);
    }
  };

  return (
    <>
      <Settings
        onClick={() => setIsOpen(true)}
        className='ml-2 h-4 w-4 cursor-pointer'
      />
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className='sm:max-w-[425px]'>
          <DialogHeader>
            <DialogTitle>Settings</DialogTitle>
            <DialogDescription>
              Customize your editing experience with these settings.
            </DialogDescription>
          </DialogHeader>
          <div className='space-y-4 py-4'>
            {/* Font Family Setting */}
            <div className='flex items-center justify-between'>
              <span className='text-muted-foreground'>Font</span>
              <Select
                value={settings.font}
                onValueChange={(value) => updateSettings({ font: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder='Select font' />
                </SelectTrigger>
                <SelectContent>
                  {fonts.map((font) => (
                    <SelectItem key={font} value={font}>
                      <span style={{ fontFamily: font }}>{font}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Font Size Setting */}
            <div className='flex items-center justify-between'>
              <span className='text-muted-foreground'>Font Size</span>
              <Select
                value={settings.fontSize}
                onValueChange={(value) => updateSettings({ fontSize: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder='Size' />
                </SelectTrigger>
                <SelectContent>
                  {['12', '14', '16', '18', '20', '22', '24'].map((size) => (
                    <SelectItem key={size} value={size}>
                      {size}px
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Directory Chooser */}
            <div className='space-y-2'>
              <div className='flex items-center justify-between'>
                <span className='text-muted-foreground'>Folder</span>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={chooseDirectory}
                  title={settings.directory || 'Choose a directory'}
                  className='flex cursor-pointer items-center gap-2'
                >
                  <Folder className='h-4 w-4' />
                  <span className='max-w-[150px] truncate'>
                    {settings.directory
                      ? getLastPathSegment(settings.directory)
                      : 'Choose'}
                  </span>
                </Button>
              </div>
            </div>

            {/* Theme Setting */}
            <div className='flex items-center justify-between'>
              <span className='text-muted-foreground'>Theme</span>
              <Button
                variant='outline'
                size='sm'
                onClick={toggleTheme}
                className='flex items-center gap-2'
              >
                {theme === 'dark' ? (
                  <>
                    <Sun className='h-4 w-4' />
                    <span>Light</span>
                  </>
                ) : (
                  <>
                    <Moon className='h-4 w-4' />
                    <span>Dark</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
