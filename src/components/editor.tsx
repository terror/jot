import { SearchDialog } from '@/components/search-dialog';
import { Search } from '@/extensions/search';
import { Position } from '@/lib/types';
import { cn, getTodayFilename } from '@/lib/utils';
import { useEntryNavigation } from '@/providers/entry-navigation-provider';
import { useSettings } from '@/providers/settings-provider';
import { useVault } from '@/providers/vault-provider';
import { Mathematics } from '@tiptap-pro/extension-mathematics';
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
import HorizontalRule from '@tiptap/extension-horizontal-rule';
import Italic from '@tiptap/extension-italic';
import Link from '@tiptap/extension-link';
import ListItem from '@tiptap/extension-list-item';
import ListKeymap from '@tiptap/extension-list-keymap';
import OrderedList from '@tiptap/extension-ordered-list';
import Paragraph from '@tiptap/extension-paragraph';
import Strike from '@tiptap/extension-strike';
import TaskItem from '@tiptap/extension-task-item';
import TaskList from '@tiptap/extension-task-list';
import Text from '@tiptap/extension-text';
import {
  EditorContent,
  Editor as TiptapEditor,
  useEditor,
} from '@tiptap/react';
import { BubbleMenu } from '@tiptap/react';
import 'katex/dist/katex.min.css';
import { BoldIcon, ItalicIcon, StrikethroughIcon } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';

const CustomHorizontalRule = HorizontalRule.extend({
  addKeyboardShortcuts() {
    return {
      'Mod-Enter': () => {
        this.editor.commands.setHorizontalRule();
        return true;
      },
    };
  },
});

interface EditorProps {
  onCursorPositionChange: (position: Position) => void;
  onStatisticsChange: (stats: { characters: number; words: number }) => void;
}

const Editor: React.FC<EditorProps> = ({
  onCursorPositionChange,
  onStatisticsChange,
}) => {
  const [searchOpen, setSearchOpen] = useState(false);

  const { settings } = useSettings();
  const { vault, updateEntry } = useVault();
  const { currentEntry } = useEntryNavigation();

  const editorContainerRef = useRef(null);

  const todayFilename = useMemo(() => getTodayFilename(), []);

  const activeEntry = useMemo(() => {
    if (currentEntry) {
      const vaultEntry = vault.entries.find(
        (e) => e.filename === currentEntry.filename
      );

      return vaultEntry || currentEntry;
    }

    const todayEntry = vault.entries.find((e) => e.filename === todayFilename);

    return todayEntry || { filename: todayFilename, content: '' };
  }, [currentEntry, vault.entries, todayFilename]);

  const editor = useEditor({
    shouldRerenderOnTransaction: false,
    extensions: [
      Blockquote,
      Bold,
      BulletList,
      CharacterCount.configure(),
      Code,
      CustomHorizontalRule,
      Document,
      Dropcursor,
      Gapcursor,
      Heading.configure({ levels: [1, 2, 3] }),
      Highlight.configure({ multicolor: true }),
      History,
      Italic,
      Link.configure(),
      ListItem,
      ListKeymap,
      Mathematics,
      OrderedList,
      Paragraph,
      Search.configure(),
      Strike,
      TaskItem,
      TaskList,
      Text,
    ],
    content: activeEntry.content,
    autofocus: true,
    editorProps: {
      attributes: {
        class: 'h-full w-full focus:outline-none prose prose-sm max-w-none',
        style: `font-family: ${settings.font}; font-size: ${settings.fontSize}px`,
      },
    },
    onCreate: ({ editor }) => {
      updateCursorPosition(editor);
      updateStatistics(editor);
    },
    onUpdate: ({ editor }) => {
      updateCursorPosition(editor);
      updateStatistics(editor);

      const content = editor.getHTML();

      if (content !== activeEntry.content) {
        saveContent(content);
      }
    },
    onSelectionUpdate: ({ editor }) => {
      updateCursorPosition(editor);
    },
  });

  useEffect(() => {
    if (editor && editor.getHTML() !== activeEntry.content) {
      editor.commands.setContent(activeEntry.content, false);

      setTimeout(() => {
        updateStatistics(editor);
      }, 0);
    }
  }, [activeEntry.content, editor]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'f') {
        e.preventDefault();
        setSearchOpen(true);
      }

      if ((e.metaKey || e.ctrlKey) && e.key === 'h') {
        e.preventDefault();
        setSearchOpen(true);
      }

      if (e.key === 'Escape' && searchOpen) {
        setSearchOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [searchOpen]);

  const saveTimeoutRef = useRef<NodeJS.Timeout>();

  const saveContent = (content: string) => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      updateEntry({
        filename: activeEntry.filename,
        content: content,
      });
    }, 2500);
  };

  const updateCursorPosition = (editor: TiptapEditor | null) => {
    if (!editor) return;

    const position = editor.view.state.doc.resolve(editor.state.selection.from);

    onCursorPositionChange({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      line: (position as any).path[1] + 1,
      column: position.parentOffset + 1,
    });
  };

  const updateStatistics = (editor: TiptapEditor | null) => {
    if (!editor) return;

    onStatisticsChange({
      characters: editor.storage.characterCount.characters(),
      words: editor.storage.characterCount.words(),
    });
  };

  if (!editor) {
    return null;
  }

  return (
    <div ref={editorContainerRef} className='h-full flex-1 overflow-auto'>
      {/* Selection Menu */}
      <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }}>
        <div className='bubble-menu'>
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={cn(
              editor.isActive('bold') ? 'is-active' : '',
              'cursor-pointer'
            )}
            title='Bold'
          >
            <BoldIcon className='h-4 w-4' />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={cn(
              editor.isActive('italic') ? 'is-active' : '',
              'cursor-pointer'
            )}
            title='Italic'
          >
            <ItalicIcon className='h-4 w-4' />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={cn(
              editor.isActive('strike') ? 'is-active' : '',
              'cursor-pointer'
            )}
            title='Strikethrough'
          >
            <StrikethroughIcon className='h-4 w-4' />
          </button>
        </div>
      </BubbleMenu>

      {/* Search Dialog */}
      <SearchDialog
        editor={editor}
        open={searchOpen}
        onOpenChange={setSearchOpen}
      />

      <EditorContent
        autoCorrect='off'
        autoComplete='off'
        spellCheck={false}
        editor={editor}
        className='text-foreground h-full'
      />
    </div>
  );
};

export default Editor;
