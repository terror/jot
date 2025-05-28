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
import { Theme } from '@/lib/typeshare';
import { displayError, getLastPathSegment } from '@/lib/utils';
import { useSettings } from '@/providers/settings-provider';
import { open } from '@tauri-apps/api/dialog';
import { Folder, Settings } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export const SettingsDialog = () => {
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
                value={settings.fontSize.toString()}
                onValueChange={(value) => updateSettings({ fontSize: parseInt(value) })}
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
<div className="flex items-center justify-between">
  <span className="text-muted-foreground">Theme</span>
  <Select
    value={settings.theme}
    onValueChange={(value: Theme) => updateSettings({ theme: value })}
  >
    <SelectTrigger>
      <SelectValue placeholder="Select theme" />
    </SelectTrigger>
    <SelectContent>
      {Object.values(Theme).map((themeValue) => (
        <SelectItem key={themeValue} value={themeValue}>
          {themeValue.charAt(0).toUpperCase() + themeValue.slice(1)}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
</div>
</div>
        </DialogContent>
      </Dialog>
    </>
  );
};
