import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Editor as TiptapEditor } from '@tiptap/react';
import { ChevronDown, ChevronUp, Replace, X } from 'lucide-react';
import { useEffect, useState } from 'react';

interface SearchDialogProps {
  editor: TiptapEditor | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SearchDialog = ({
  editor,
  open,
  onOpenChange,
}: SearchDialogProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [replaceTerm, setReplaceTerm] = useState('');
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [showReplace, setShowReplace] = useState(false);

  const results = editor?.storage.search?.results || [];
  const currentIndex = editor?.storage.search?.resultIndex || 0;

  useEffect(() => {
    if (editor && searchTerm) {
      editor.commands.setSearchTerm(searchTerm);
      editor.commands.setCaseSensitive(caseSensitive);
    }
  }, [editor, searchTerm, caseSensitive]);

  const handleNext = () => {
    if (editor && results.length > 0) {
      editor.commands.nextSearchResult();
    }
  };

  const handlePrevious = () => {
    if (editor && results.length > 0) {
      editor.commands.previousSearchResult();
    }
  };

  const handleReplace = () => {
    if (editor && replaceTerm) {
      editor.commands.setReplaceTerm(replaceTerm);
      editor.commands.replace();
    }
  };

  const handleReplaceAll = () => {
    if (editor && replaceTerm) {
      editor.commands.setReplaceTerm(replaceTerm);
      editor.commands.replaceAll();
    }
  };

  const handleClose = () => {
    if (editor) {
      editor.commands.setSearchTerm('');
      editor.commands.resetIndex();
    }
    setSearchTerm('');
    setReplaceTerm('');
    onOpenChange(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleNext();
    } else if (e.key === 'Enter' && e.shiftKey) {
      e.preventDefault();
      handlePrevious();
    } else if (e.key === 'Escape') {
      handleClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[500px] [&>button]:hidden'>
        <div className='space-y-4'>
          {/* Search Input */}
          <div className='flex items-center gap-2'>
            <div className='flex-1'>
              <Input
                autoComplete='off'
                autoCorrect='off'
                autoFocus
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder='Search...'
                value={searchTerm}
              />
            </div>
            <div className='flex items-center gap-1'>
              <Button
                variant='ghost'
                size='icon'
                onClick={handlePrevious}
                disabled={results.length === 0}
                title='Previous (Shift+Enter)'
              >
                <ChevronUp className='h-4 w-4' />
              </Button>
              <Button
                variant='ghost'
                size='icon'
                onClick={handleNext}
                disabled={results.length === 0}
                title='Next (Enter)'
              >
                <ChevronDown className='h-4 w-4' />
              </Button>
            </div>
          </div>

          {/* Search Results Info */}
          {searchTerm && (
            <div className='text-muted-foreground text-sm'>
              {results.length === 0
                ? 'No results found'
                : `${currentIndex + 1} of ${results.length} matches`}
            </div>
          )}

          {/* Replace Section */}
          {showReplace && (
            <div className='space-y-3 border-t pt-4'>
              <div className='flex items-center gap-2'>
                <Input
                  autoComplete='off'
                  autoCorrect='off'
                  onChange={(e) => setReplaceTerm(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder='Replace with...'
                  value={replaceTerm}
                />
              </div>
              <div className='flex items-center gap-2'>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={handleReplace}
                  disabled={results.length === 0}
                >
                  Replace
                </Button>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={handleReplaceAll}
                  disabled={results.length === 0}
                >
                  Replace All
                </Button>
              </div>
            </div>
          )}

          {/* Options */}
          <div className='flex items-center justify-between border-t pt-4'>
            <div className='flex items-center gap-4'>
              <label className='flex items-center gap-2 text-sm'>
                <input
                  type='checkbox'
                  checked={caseSensitive}
                  onChange={(e) => setCaseSensitive(e.target.checked)}
                  className='rounded'
                />
                Case sensitive
              </label>
            </div>
            <div className='flex items-center gap-2'>
              <Button
                variant='ghost'
                size='sm'
                onClick={() => setShowReplace(!showReplace)}
                className='flex items-center gap-2'
              >
                <Replace className='h-4 w-4' />
                {showReplace ? 'Hide Replace' : 'Replace'}
              </Button>
              <Button variant='ghost' size='icon' onClick={handleClose}>
                <X className='h-4 w-4' />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
