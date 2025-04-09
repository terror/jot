import { Time } from '@/components/time';
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
import { Position } from '@/lib/types';
import { useTheme } from '@/providers/theme-provider';
import { open } from '@tauri-apps/api/dialog';
import Blockquote from '@tiptap/extension-blockquote';
import Bold from '@tiptap/extension-bold';
import BulletList from '@tiptap/extension-bullet-list';
import CharacterCount from '@tiptap/extension-character-count';
import Code from '@tiptap/extension-code';
import Document from '@tiptap/extension-document';
import Dropcursor from '@tiptap/extension-dropcursor';
import Gapcursor from '@tiptap/extension-gapcursor';
import Heading from '@tiptap/extension-heading';
import Highlight from '@tiptap/extension-highlight';
import History from '@tiptap/extension-history';
import Italic from '@tiptap/extension-italic';
import ListItem from '@tiptap/extension-list-item';
import ListKeymap from '@tiptap/extension-list-keymap';
import OrderedList from '@tiptap/extension-ordered-list';
import Paragraph from '@tiptap/extension-paragraph';
import Strike from '@tiptap/extension-strike';
import TaskItem from '@tiptap/extension-task-item';
import TaskList from '@tiptap/extension-task-list';
import Text from '@tiptap/extension-text';
import { Editor, EditorContent, useEditor } from '@tiptap/react';
import { BubbleMenu } from '@tiptap/react';
import { Folder, Moon, Settings, Sun } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { getLastPathSegment } from './lib/utils';

const App = () => {
  const { theme, setTheme } = useTheme();

  const [cursorPosition, setCursorPosition] = useState<Position>({
    line: 1,
    column: 1,
  });

  const [characterCount, setCharacterCount] = useState<{
    characters: number;
    words: number;
  }>({
    characters: 0,
    words: 0,
  });

  const [directory, setDirectory] = useState('');
  const [fontSize, setFontSize] = useState('16');
  const [fonts, setFonts] = useState<string[]>([]);
  const [selectedFont, setSelectedFont] = useState('Inter');
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false);

  const editorContainerRef = useRef<HTMLDivElement>(null);

  const getLineHeight = () => `${Math.round(parseInt(fontSize) * 1.5)}px`;

  const editor = useEditor({
    extensions: [
      Blockquote,
      Bold,
      BulletList,
      CharacterCount.configure(),
      Code,
      Document,
      Dropcursor,
      Gapcursor,
      Heading.configure({ levels: [1, 2, 3] }),
      Highlight.configure({ multicolor: true }),
      History,
      Italic,
      ListItem,
      ListKeymap,
      OrderedList,
      Paragraph,
      Strike,
      TaskItem,
      TaskList,
      Text,
    ],
    autofocus: true,
    editorProps: {
      attributes: {
        class: 'h-full w-full focus:outline-none prose prose-sm max-w-none',
        style: `font-family: ${selectedFont}; font-size: ${fontSize}px; line-height: ${getLineHeight()};`,
      },
    },
    onUpdate: ({ editor }) => {
      updateCursorPosition(editor);
      updateCharacterCount(editor);
    },
    onSelectionUpdate: ({ editor }) => {
      updateCursorPosition(editor);
    },
  });

  const updateCursorPosition = (editor: Editor | null): void => {
    if (!editor) return;

    const { from } = editor.state.selection;

    const position = editor.view.state.doc.resolve(from);

    const line = (position as any).path[1] + 1;

    setCursorPosition({
      line,
      column: position.parentOffset + 1,
    });
  };

  const updateCharacterCount = (editor: Editor | null): void => {
    if (!editor) return;

    const characters = editor.storage.characterCount.characters();

    const words = editor.storage.characterCount.words();

    setCharacterCount({ characters, words });
  };

  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');

  const openDirectoryPicker = async () => {
    try {
      const selected = await open({
        directory: true,
        multiple: false,
      });

      if (selected !== null) {
        const path = Array.isArray(selected) ? selected[0] : selected;
        setDirectory(path);
      }
    } catch (error) {
      console.error('Failed to open directory picker:', error);
    }
  };

  const getSystemFonts = async () => {
    try {
      setFonts([
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
    } catch (error) {
      console.error('Failed to get system fonts:', error);
      setFonts(['Arial', 'Helvetica', 'Times New Roman', 'Courier New']);
    }
  };

  const updateEditorFont = () => {
    if (editor) {
      editor.view.dom.style.fontFamily = selectedFont;
      editor.view.dom.style.fontSize = `${fontSize}px`;
      editor.view.dom.style.lineHeight = getLineHeight();
    }
  };

  const fontSizeOptions = ['12', '14', '16', '18', '20', '22', '24'];

  useEffect(() => {
    getSystemFonts();
  }, []);

  useEffect(() => {
    updateEditorFont();
  }, [selectedFont, fontSize, editor]);

  useEffect(() => {
    if (editor) {
      updateCharacterCount(editor);
    }
  }, [editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className='bg-background flex h-screen w-screen flex-col'>
      <div className='bg-background caret-foreground flex flex-grow overflow-hidden'>
        {/* Selection Menu */}
        {editor && (
          <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }}>
            <div className='bubble-menu'>
              <button
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={editor.isActive('bold') ? 'is-active' : ''}
              >
                Bold
              </button>
              <button
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={editor.isActive('italic') ? 'is-active' : ''}
              >
                Italic
              </button>
              <button
                onClick={() => editor.chain().focus().toggleStrike().run()}
                className={editor.isActive('strike') ? 'is-active' : ''}
              >
                Strike
              </button>
            </div>
          </BubbleMenu>
        )}

        {/* Settings Dialog */}
        <Dialog open={settingsDialogOpen} onOpenChange={setSettingsDialogOpen}>
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
                <Select value={selectedFont} onValueChange={setSelectedFont}>
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
                <span className='text-muted-foreground'>Font size</span>
                <Select value={fontSize} onValueChange={setFontSize}>
                  <SelectTrigger>
                    <SelectValue placeholder='Size' />
                  </SelectTrigger>
                  <SelectContent>
                    {fontSizeOptions.map((size) => (
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
                  <span className='text-muted-foreground'>Save location</span>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={openDirectoryPicker}
                    title={directory || 'Choose a directory'}
                    className='flex cursor-pointer items-center gap-2'
                  >
                    <Folder className='h-4 w-4' />
                    <span className='max-w-[150px] truncate'>
                      {directory ? getLastPathSegment(directory) : 'Choose'}
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

        {/* Editor */}
        <div ref={editorContainerRef} className='h-full flex-1 overflow-auto'>
          <EditorContent
            autoCorrect='off'
            autoComplete='off'
            spellCheck={false}
            editor={editor}
            className='text-foreground h-full'
          />
        </div>
      </div>

      {/* Status */}
      <div
        className={`border-border border-t text-xs ${theme === 'dark' ? 'bg-zinc-900 text-zinc-400' : 'bg-zinc-800 text-zinc-300'}`}
      >
        <div className='flex justify-between p-2'>
          <div className='flex gap-2'>
            <span>
              {cursorPosition.line}:{cursorPosition.column}
            </span>
            <span>C {characterCount.characters}</span>
            <span>W {characterCount.words}</span>
          </div>
          <div className='flex items-center gap-x-2'>
            <Time />
            <Settings
              onClick={() => setSettingsDialogOpen(true)}
              className='ml-2 h-4 w-4 cursor-pointer'
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
